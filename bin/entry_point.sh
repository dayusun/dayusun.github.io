#!/bin/bash
set -euo pipefail

echo "Entry point script running"

CONFIG_FILE=_config.yml
DOCKER_DESTINATION=/tmp/_site

# Function to manage Gemfile.lock
manage_gemfile_lock() {
    git config --global --add safe.directory /srv/jekyll
    if command -v git &> /dev/null && [ -f Gemfile.lock ]; then
        if git ls-files --error-unmatch Gemfile.lock &> /dev/null; then
            echo "Gemfile.lock is tracked by git, keeping it intact"
            git restore Gemfile.lock 2>/dev/null || true
        else
            echo "Gemfile.lock is not tracked by git, removing it"
            rm Gemfile.lock
        fi
    fi
}

ensure_bundle_deps() {
    if bundle check >/dev/null 2>&1; then
        echo "Bundler dependencies already satisfied"
        return
    fi

    echo "Installing missing bundler dependencies"
    bundle install --jobs 4 --retry 3
}

start_jekyll() {
    manage_gemfile_lock
    ensure_bundle_deps
    mkdir -p "$DOCKER_DESTINATION"
    bundle exec jekyll serve --watch --port=8080 --host=0.0.0.0 --livereload --verbose --trace --force_polling --destination "$DOCKER_DESTINATION" --config "$CONFIG_FILE" &
}

start_jekyll

while true; do
    # inotifywait can fail transiently (e.g. the watched file is atomically
    # replaced); don't let set -e take the whole supervisor down with it.
    inotifywait -q -e modify,move,create,delete $CONFIG_FILE || { sleep 1; continue; }
    echo "Change detected to $CONFIG_FILE, restarting Jekyll"
    # Match only the serve process: a bare "jekyll" pattern also matches this
    # script's own /srv/jekyll/... path, so the restart would kill the supervisor.
    jekyll_pid=$(pgrep -f "jekyll serve" || true)
    if [ -n "$jekyll_pid" ]; then
        kill -KILL $jekyll_pid 2>/dev/null || true
    fi
    start_jekyll
done

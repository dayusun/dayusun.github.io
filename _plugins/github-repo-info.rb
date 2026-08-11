# Fetches repository metadata from the GitHub API at build time so that
# `_includes/repository/repo.liquid` can render self-contained HTML cards.
#
# This replaces the runtime dependency on github-readme-stats.vercel.app, whose
# public instance has been shut down (HTTP 503 DEPLOYMENT_PAUSED).
#
# Results land in `site.data["github_repo_info"][<owner/name>]` and are cached in
# `.jekyll-cache/github-repo-info.json` so repeated local builds do not re-hit
# the API. Set GITHUB_TOKEN to raise the anonymous 60 req/hour rate limit.
#
# Every failure mode degrades to a card with just the repository name and link;
# the build is never broken by an API outage.

require "json"
require "net/http"
require "uri"
require "fileutils"

module GithubRepoInfo
  CACHE_TTL = 60 * 60 * 6 # seconds; stale entries are refetched, but reused if the API fails

  class Generator < Jekyll::Generator
    safe true
    priority :high

    def generate(site)
      repos = Array(site.data.dig("repositories", "github_repos"))
      site.data["github_repo_info"] = {}
      return if repos.empty?

      cache_path = File.join(site.source, ".jekyll-cache", "github-repo-info.json")
      cache = read_cache(cache_path)
      now = Time.now.to_i

      repos.each do |repo|
        cached = cache[repo]
        if cached && cached["fetched_at"] && (now - cached["fetched_at"]) < CACHE_TTL
          site.data["github_repo_info"][repo] = cached
          next
        end

        fetched = fetch(repo)
        if fetched
          fetched["fetched_at"] = now
          cache[repo] = fetched
          site.data["github_repo_info"][repo] = fetched
        elsif cached
          # API unreachable or rate limited: keep serving the last known good data.
          Jekyll.logger.warn "GitHub repo info:", "using stale cache for #{repo}"
          site.data["github_repo_info"][repo] = cached
        else
          Jekyll.logger.warn "GitHub repo info:", "no data for #{repo}, rendering name only"
          site.data["github_repo_info"][repo] = { "error" => true }
        end
      end

      write_cache(cache_path, cache)
    end

    private

    def fetch(repo)
      uri = URI("https://api.github.com/repos/#{repo}")
      request = Net::HTTP::Get.new(uri)
      request["Accept"] = "application/vnd.github+json"
      request["User-Agent"] = "al-folio-build"
      token = ENV["GITHUB_TOKEN"] || ENV["GH_TOKEN"]
      request["Authorization"] = "Bearer #{token}" if token && !token.empty?

      response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true, open_timeout: 10, read_timeout: 10) do |http|
        http.request(request)
      end

      unless response.is_a?(Net::HTTPSuccess)
        Jekyll.logger.warn "GitHub repo info:", "#{repo} returned HTTP #{response.code}"
        return nil
      end

      data = JSON.parse(response.body)
      {
        "full_name" => data["full_name"],
        "owner" => data.dig("owner", "login"),
        "name" => data["name"],
        "description" => clean_description(data["description"]),
        "language" => data["language"],
        "stars" => data["stargazers_count"],
        "forks" => data["forks_count"],
        "archived" => data["archived"],
        "html_url" => data["html_url"],
      }
    rescue StandardError => e
      Jekyll.logger.warn "GitHub repo info:", "#{repo} failed: #{e.class}: #{e.message}"
      nil
    end

    # GitHub descriptions often contain :emoji_shortcodes:. The jemoji plugin would
    # expand those into <img> tags pointing at github.githubassets.com, which is
    # exactly the remote dependency these build-time cards exist to avoid.
    #
    # They also contain U+00A0 no-break spaces (the CRAN mirror descriptions are
    # full of them), which stop the text wrapping inside a narrow card.
    def clean_description(description)
      return nil if description.nil?
      description
        .gsub(/:[a-z0-9_+-]+:/, " ")
        .gsub(/[\u{00A0}\u{2007}\u{202F}]/, " ")
        .squeeze(" ")
        .strip
    end

    def read_cache(path)
      return {} unless File.exist?(path)
      JSON.parse(File.read(path))
    rescue StandardError
      {}
    end

    def write_cache(path, cache)
      FileUtils.mkdir_p(File.dirname(path))
      File.write(path, JSON.pretty_generate(cache))
    rescue StandardError => e
      Jekyll.logger.warn "GitHub repo info:", "could not write cache: #{e.message}"
    end
  end
end

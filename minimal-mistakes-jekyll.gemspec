# encoding: utf-8
require "json"

# UTF-8 인코딩 강제 설정
ENV['LANG'] ||= 'en_US.UTF-8'

# package.json 파일을 읽어서 버전 정보 가져오기
package_json = JSON.parse(File.read("package.json"))

Gem::Specification.new do |spec|
  spec.name                    = "minimal-mistakes-jekyll"
  spec.version                 = package_json["version"]
  spec.authors                 = ["Michael Rose", "iBug"]

  spec.summary                 = %q{A flexible two-column Jekyll theme.}
  spec.homepage                = "https://github.com/mmistakes/minimal-mistakes"
  spec.license                 = "MIT"

  spec.metadata["plugin_type"] = "theme"

  # 인코딩 문제 해결을 위해 UTF-8로 설정
  spec.files                   = `git ls-files -z`.force_encoding("UTF-8").split("\x0").select do |f|
    f.match(%r{^(assets|_(data|includes|layouts|sass)/|(LICENSE|README|CHANGELOG)((\.(txt|md|markdown)|$)))}i)
  end

  # 의존성 추가
  spec.add_runtime_dependency "jekyll", ">= 3.7", "< 5.0"
  spec.add_runtime_dependency "jekyll-paginate", "~> 1.1"
  spec.add_runtime_dependency "jekyll-sitemap", "~> 1.3"
  spec.add_runtime_dependency "jekyll-gist", "~> 1.5"
  spec.add_runtime_dependency "jekyll-feed", "~> 0.1"
  spec.add_runtime_dependency "jekyll-include-cache", "~> 0.1"

  spec.add_development_dependency "bundler"
  spec.add_development_dependency "rake", ">= 12.3.3"
end

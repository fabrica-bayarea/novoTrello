group "default" {
  targets = ["api", "webui"]
}

target "api" {
  context = "./back-end/"
  dockerfile = "Dockerfile"
  tags = ["iesb-bayarea/novo-trello-api:latest"]
  labels = {
    "maintainer" = "IESB Bay Area <nde.ads@iesb.br>"
    "org.opencontainers.image.title" = "Novo Trello API"
    "org.opencontainers.image.description" = "API for Novo Trello, a project management task."
    "org.opencontainers.image.source" = "https://github.com/fabrica-bayarea/novoTrello"
    "org.opencontainers.image.version" = "0.1"
    "org.opencontainers.image.licenses" = "GPL-3.0"
    "org.opencontainers.image.author" = "nde.ads@iesb.br"
  }
}

target "webui" {
  context = "./front-end/"
  dockerfile = "Dockerfile"
  tags = ["iesb-bayarea/novo-trello-webui:latest"]
  labels = {
    "maintainer" = "IESB Bay Area <nde.ads@iesb.br>"
    "org.opencontainers.image.title" = "Novo Trello Web UI"
    "org.opencontainers.image.description" = "Web interface for Novo Trello"
    "org.opencontainers.image.source" = "https://github.com/fabrica-bayarea/novoTrello"
    "org.opencontainers.image.version" = "0.1"
    "org.opencontainers.image.licenses" = "GPL-3.0"
    "org.opencontainers.image.author" = "nde.ads@iesb.br"
  }
}

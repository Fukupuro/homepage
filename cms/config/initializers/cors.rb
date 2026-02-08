Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV.fetch("CORS_ORIGIN", "localhost:4321")

    resource "/api/*",
      headers: :any,
      methods: [ :get, :options ],
      credentials: false
  end
end

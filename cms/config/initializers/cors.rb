Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "localhost:4321"

    resource '/api/*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: false
  end
end
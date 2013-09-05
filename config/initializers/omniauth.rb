OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  configure do |config|
    config.path_prefix = '/auth'
  end
  if Rails.env == "development" || Rails.env == "test"
  provider :facebook, '163465247039548', 'b398d0ddaec71bf3d139dc793371fd5d'
  else
  provider :facebook, '170911729597020', '3a0629e01e8b176a5f4769c07060e7d1'
  end
 
end
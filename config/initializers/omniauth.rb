OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  configure do |config|
    config.path_prefix = '/auth'
  end
  if Rails.env == "development" || Rails.env == "test"
  provider :facebook, '163465247039548', 'b398d0ddaec71bf3d139dc793371fd5d'
  else
  provider :facebook, 'XXXXXXX', 'XXXXXXXXX'
  end
 
end
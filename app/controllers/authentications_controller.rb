class AuthenticationsController < ApplicationController

	def create
    auth = request.env["omniauth.auth"]
 
	  
	  if auth['provider'] == 'facebook' then
		  authentication = Authentication.find_by_provider_and_uid(auth['provider'], auth['uid'])
		 
		  if authentication and authentication.user
		    # Authentication found, sign the user in.

		    authentication.user.apply_omniauth(auth)
		    #flash[:notice] = "Login efetuado com sucesso."
		    #self.class.layout 'application'

		    authentication.user.save

		    current_user = authentication.user
		    #sign_in_and_redirect(:user, authentication.user)
		    sign_in(:user, authentication.user)

		    #session[:facebook_auth] = authentication.token
		    session[:facebook_auth] = auth['credentials']['token']

		    redirect_to root_path

		  else
		    # Authentication not found, thus a new user.
		    #user = User.new
		    #user.apply_omniauth(auth)
		    #session[:facebook_auth] = auth.token
		    user = User.find_by_email(auth['extra']['raw_info']['email'])
            if !user then
                user = User.new
            end

            if !auth['extra']['raw_info']['email'] then
            	flash[:error] = "Nao conseguimos retornar o seu e-mail cadastrado no Facebook."
              	redirect_to root_url
            end

            user.apply_omniauth(auth)
            session[:facebook_auth] = auth['credentials']['token']
            if user.save(:validate => false)
              flash[:notice] = "Seu registro foi efetuado com sucesso."
              sign_in_and_redirect(:user, user)
            else
              flash[:error] = "Ocorreu um erro ao criar sua conta. Por favor tente novamente."
              redirect_to root_url
            end

		  end

	 elsif auth['provider'] == 'runkeeper' then
	 	authentication = Authentication.find_by_provider_and_uid(auth['provider'], auth['uid'])
	 	if !authentication
	 		authentication = Authentication.new
	 		authentication.provider = auth['provider']
	 		authentication.uid = auth['uid']
	 		authentication.token = auth['credentials']['token']
	 		authentication.save
	 	end
	 	session[:runkeeper_auth] = authentication.token
	 	#logger.info authentications.inspect
	 	#current_user.runkeepertoken = authentications.token
	 	#current_user.save
	 	redirect_to runkeeper_runentries_path
	 	
	 end
  end
  
end

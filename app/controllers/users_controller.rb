class UsersController < ApplicationController
  def index
  end

  def show
  	@user = User.find(params[:id])
  	@routes = @user.routes.paginate(:page => params[:page], :per_page => 5)
    respond_to do |format|
      format.html # show.html.erb
      format.json { render :json => @route }
    end
  end

  def profile
  	@user = current_user
  	@routes = current_user.routes.paginate(:page => params[:page], :per_page => 5)
    respond_to do |format|
      format.html { render :action => "show" }
      format.json { render :json => @routes }
    end
  end

  def watching

    current_user.favorites
  	##@routes = current_user.routes.paginate(:page => params[:page], :per_page => 10)
    @routes = current_user.favorites.paginate(:page => params[:page], :per_page => 5)

    respond_to do |format|
      format.html
      format.json { render :json => @routes }
    end

  end
end

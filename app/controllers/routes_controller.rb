class RoutesController < ApplicationController
  before_filter :authenticate_user!
  #load_and_authorize_resource

  def start

  end

  # GET /routes
  # GET /routes.json
  def index
    if params[:user_id]
    @routes = User.find(params[:user_id]).routes.paginate(:page => params[:page], :per_page => 10)
    else
    @routes = Route.where("user_id != ?", current_user.id).paginate(:page => params[:page], :per_page => 10)
    end 

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @routes }
    end
  end

  # GET /routes/1
  # GET /routes/1.json
  def show
    @route = Route.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @route }
    end
  end

  # GET /routes/new
  # GET /routes/new.json
  def new
    @route = Route.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @route }
    end
  end

  # GET /routes/1/edit
  def edit
    @route = Route.find(params[:id])
  end

  # POST /routes
  # POST /routes.json
  def create
    @route = Route.new(params[:route])
    @route.user = current_user

    respond_to do |format|
      if @route.save
        format.html { redirect_to user_routes_path(current_user), notice: 'Route was successfully created.' }
        format.json { render json: @route, status: :created, location: @route }
      else
        format.html { render action: "new" }
        format.json { render json: @route.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /routes/1
  # PUT /routes/1.json
  def update
    @route = Route.find(params[:id])

    @route.user = current_user

    respond_to do |format|
      if @route.update_attributes(params[:route])
        format.html { redirect_to user_routes_path(current_user), notice: 'Route was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @route.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /routes/1
  # DELETE /routes/1.json
  def destroy
    @route = Route.find(params[:id])
    @route.destroy

    respond_to do |format|
      format.html { redirect_to routes_url }
      format.json { head :no_content }
    end
  end

  def favorite
    @route = Route.find(params[:id])
    current_user.favorites << @route

    if request.xhr?
    render inline: "Rota adicionada aos favoritos"
    else

    end
  end

  def favorite_delete
    @route = Route.find(params[:id])
    current_user.favorites.delete(@route)
    if request.xhr?
    render inline: "Rota removida dos favoritos"
    else

    end
  end
end

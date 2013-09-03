require 'test_helper'
include Devise::TestHelpers

class RouteTest < ActiveSupport::TestCase
  
	test "should not save route without required attributes" do
		route = Route.new
 		assert !route.save, "saved route without end_point"
	end

	test "should save route with required attributes" do
		route = Route.new
		route.end_point = "(1, 1)"
		route.start_point = "(1, 1)"

		@user = users(:one)
    	sign_in @user

		route.user_id = @user.id

 		assert route.save, "saved route with required attrivutes"
	end



end

class CustomersController < ApplicationController
  def index
    respond_to do |format|
      format.html {}
      format.json do
        render json: CustomerFinder.new(params).call
      end
    end
  end
end

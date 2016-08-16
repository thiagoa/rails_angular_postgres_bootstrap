class CustomersController < ApplicationController
  def index
    respond_to do |format|
      format.html {}
      format.json do
        render json: CustomerFinder.new(params).call
      end
    end
  end

  def show
    customer = Customer.find(params[:id])

    respond_to do |format|
      format.json { render json: customer }
    end
  end
end

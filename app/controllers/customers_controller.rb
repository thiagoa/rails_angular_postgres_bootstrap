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
    customer_detail = CustomerDetail.find(params[:id])

    respond_to do |format|
      format.json { render json: customer_detail }
    end
  end

  def update
    customer_detail = CustomerDetail.find(params[:id])
    customer_detail.update(params)

    head :ok
  end
end

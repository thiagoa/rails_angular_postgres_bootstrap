class CustomersController < ApplicationController
  def index
    page = (params[:page] || 0).to_i
    per_page = (params[:per_page] || 10).to_i

    if params[:keywords].present?
      keywords = params[:keywords]

      customer_search_term = CustomerSearchTerm.new(keywords)

      customer_scope = Customer.where(
        customer_search_term.where_clause,
        customer_search_term.where_args
      )

      count = customer_scope.count
      customers = customer_scope
        .order(customer_search_term.order)
        .offset(per_page * page)
        .limit(per_page)

    else
      customers = []
    end

    respond_to do |format|
      format.html {}
      format.json do
        render json: { count: count, records: customers }
      end
    end
  end
end

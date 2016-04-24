class CustomerFinder
  def initialize(params)
    @params = params
    @page = (params[:page] || 0).to_i
    @per_page = (params[:per_page] || 10).to_i
  end

  def call
    { count: count, records: customers }
  end

  private

  def count
    return 0 unless keywords?

    customer_scope.count
  end

  def keywords?
    @params[:keywords].present?
  end

  def customers
    return [] unless keywords?

    customer_scope
      .order(customer_search_term.order)
      .offset(@per_page * @page)
      .limit(@per_page)
  end

  def customer_scope
    @customer_scope ||= Customer.where(
      customer_search_term.where_clause,
      customer_search_term.where_args
    )
  end

  def customer_search_term
    @customer_search_term ||= CustomerSearchTerm.new(@params[:keywords])
  end
end

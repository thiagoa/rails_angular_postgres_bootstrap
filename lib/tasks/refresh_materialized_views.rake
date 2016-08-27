desc 'Refresh materialized views'
task refresh_materialized_views: :environment do
  ActiveRecord::Base.connection.execute %{
    REFRESH MATERIALIZED VIEW customer_details
  }
end

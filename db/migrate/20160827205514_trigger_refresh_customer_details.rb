class TriggerRefreshCustomerDetails < ActiveRecord::Migration
  TABLES = %w(customers customer_shipping_addresses customer_billing_addresses addresses)

  def up
    execute %{
      CREATE OR REPLACE FUNCTION
        refresh_customer_details()
        RETURNS TRIGGER LANGUAGE PLPGSQL
      AS $$
      BEGIN
        REFRESH MATERIALIZED VIEW customer_details;
        RETURN NULL;
      END $$;
    }

    TABLES.each do |table|
      execute %{
        CREATE TRIGGER refresh_customer_details
        AFTER
          INSERT OR
          UPDATE OR
          DELETE
        ON #{table}
          FOR EACH STATEMENT
            EXECUTE PROCEDURE
              refresh_customer_details()
      }
    end
  end

  def down
    TABLES.each do |table|
      execute "DROP TRIGGER refresh_customer_details ON #{table}"
    end

    execute 'DROP FUNCTION refresh_customer_details()'
  end
end

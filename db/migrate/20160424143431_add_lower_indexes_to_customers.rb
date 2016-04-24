class AddLowerIndexesToCustomers < ActiveRecord::Migration
  def up
    execute %{
      CREATE INDEX
        customers_lower_last_name
      ON
        customers(lower(last_name) varchar_pattern_ops)
    }

    execute %{
      CREATE INDEX
        customers_lower_first_name
      ON
        customers(lower(first_name) varchar_pattern_ops)
    }

    execute %{
      CREATE INDEX
        customers_lower_email
      ON
        customers(lower(email))
    }
  end

  def down
    execute 'DROP INDEX customers_lower_last_name'
    execute 'DROP INDEX customers_lower_first_name'
    execute 'DROP INDEX customers_lower_email'
  end
end

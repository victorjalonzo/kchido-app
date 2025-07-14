import { useCustomerList } from "./useCustomerList"
import { useCustomerDialogs } from "./useCustomerDialogs"
import { useCustomerActions } from "./useCustomerActions"

export function useCustomerPage() {
  const list = useCustomerList()
  const dialogs = useCustomerDialogs()
  const actions = useCustomerActions(
    list.customers,
    list.setCustomers,
    list.applyFilters,
    list.filters
  )

  return {
    ...list,
    ...dialogs,
    ...actions,
  }
}

import { Customer } from './customerService'

/**
 * Convert customer data to CSV format
 */
export function customersToCSV(customers: Customer[]): string {
  if (customers.length === 0) {
    return 'No customers to export'
  }

  // Define CSV headers
  const headers = [
    'ID',
    'Name',
    'Email',
    'Phone',
    'Location',
    'Join Date',
    'Total Orders',
    'Total Spent',
    'Last Order Date',
    'Status',
    'Role'
  ]

  // Convert customers to CSV rows
  const rows = customers.map(customer => [
    customer.id,
    `"${customer.name}"`, // Wrap in quotes to handle commas in names
    customer.email,
    customer.phone || '',
    customer.location || '',
    new Date(customer.joinDate).toLocaleDateString(),
    customer.totalOrders.toString(),
    customer.totalSpent.toFixed(2),
    customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'Never',
    customer.status,
    customer.role
  ])

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n')

  return csvContent
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string = 'customers.csv'): void {
  // Create blob with CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  
  // Create download link
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  // Add to DOM, click, and remove
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up URL object
  URL.revokeObjectURL(url)
}

/**
 * Export customers to CSV and download
 */
export function exportCustomersToCSV(customers: Customer[], filename?: string): void {
  const csvContent = customersToCSV(customers)
  const exportFilename = filename || `customers-export-${new Date().toISOString().split('T')[0]}.csv`
  downloadCSV(csvContent, exportFilename)
}

/**
 * Format customer data for display in export
 */
export function formatCustomerForExport(customer: Customer) {
  return {
    'Customer ID': customer.id,
    'Full Name': customer.name,
    'Email Address': customer.email,
    'Phone Number': customer.phone || 'N/A',
    'Location': customer.location || 'N/A',
    'Join Date': new Date(customer.joinDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    'Total Orders': customer.totalOrders,
    'Total Spent': `$${customer.totalSpent.toFixed(2)}`,
    'Last Order': customer.lastOrderDate 
      ? new Date(customer.lastOrderDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'Never',
    'Customer Status': customer.status.charAt(0).toUpperCase() + customer.status.slice(1),
    'Account Type': customer.role.charAt(0).toUpperCase() + customer.role.slice(1)
  }
}

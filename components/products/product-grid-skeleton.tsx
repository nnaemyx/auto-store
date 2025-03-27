export default function ProductsGridSkeleton() {
    return (
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Filters Sidebar Skeleton */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
  
            {/* Filter groups skeleton */}
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="flex items-center">
                        <div className="h-4 w-4 bg-gray-200 rounded mr-2 animate-pulse" />
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                      </div>
                    ))}
                    <div className="h-8 w-full bg-gray-200 rounded mt-2 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        {/* Product Grid Skeleton */}
        <div className="flex-1">
          {/* Desktop sort controls skeleton */}
          <div className="hidden md:flex justify-end mb-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
  
          {/* Products grid skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-md overflow-hidden border border-gray-200">
                <div className="relative h-40 md:h-48 bg-gray-100 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                  <div className="flex gap-1 mt-2">
                    {[...Array(2)].map((_, j) => (
                      <div key={j} className="h-4 w-12 bg-gray-200 rounded-full animate-pulse" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  
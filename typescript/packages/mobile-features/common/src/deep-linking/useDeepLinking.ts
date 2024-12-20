import { useEffect } from 'react'
import branch, { BranchParams } from 'react-native-branch'

interface DeepLinkingParams {
  navigateToContent: (params: BranchParams) => void
}

export const useDeepLinking = ({ navigateToContent }: DeepLinkingParams) => {
  useEffect(() => {
    const branchUnsubscribe = branch.subscribe(({ error, params }) => {
      if (error) {
        console.error(`Error from Branch: ${error}`)
      }
      if (params) {
        if (!params['+clicked_branch_link']) {
          return
        }
        if (params.$canonical_identifier) {
          navigateToContent(params)
        }
      }
    })
    return () => {
      branchUnsubscribe()
    }
  }, [navigateToContent])
}

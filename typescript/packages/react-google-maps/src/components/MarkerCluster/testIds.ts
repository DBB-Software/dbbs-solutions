const markerCLusterPrefix = 'marker-cluster'

export const MARKER_CLUSTER_TEST_IDS = {
  getAdvancedMarkerTestId: (id: string) => `${markerCLusterPrefix}-advanced-marker-${id}`,
  getPinTestId: (id: string) => `${markerCLusterPrefix}-pin-${id}`
}

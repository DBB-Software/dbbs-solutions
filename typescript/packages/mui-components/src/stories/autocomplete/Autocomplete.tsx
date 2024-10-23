import { Autocomplete as MUIAutocomplete, AutocompleteProps } from '../..'

const Autocomplete = <T,>(props: AutocompleteProps<T, boolean, boolean, boolean>) => <MUIAutocomplete {...props} />

export { Autocomplete }

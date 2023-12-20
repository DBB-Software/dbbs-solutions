import { Theme } from '@mui/material'
import { SystemStyleObject } from '@mui/system'

export type SxStylesValue = SystemStyleObject<Theme> | ((theme: Theme) => SystemStyleObject<Theme>)

/**
 * A utility function to create a styles object that supports intellisense.
 *
 * @example
 * ```typescript
 * const makeStyles = (props: ComponentProps) =>
 *   makeSxStyles({
 *     container: {
 *       display: 'flex',
 *       justifyContent: 'space-between',
 *     },
 *     nav: theme => ({
 *       lineHeight: '1rem',
 *       display: props.showNav ? 'flex' : 'none',
 *       [theme.breakpoints.down('sm')]: {
 *         justifyContent: 'space-between',
 *       },
 *     }),
 *   });
 *
 * const ExampleComponent = (props: ComponentProps) => {
 *   const styles = makeStyles(props);
 *
 *   return (
 *     <Container sx={styles.container}>
 *       <Box sx={styles.nav} component="nav">
 *         Example
 *       </Box>
 *     </Container>
 *   );
 * };
 * ```
 *
 * @param styles The object that defines the keys and corresponding styles.
 * @returns A type-safe record of keys that map to valid SxProps.
 */
export const makeSxStyles = <T>(styles: {
  [K in keyof T]: SxStylesValue
}) => styles

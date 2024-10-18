export const autogenCommentPlugin = {
  add: {
    placement: 'prepend',
    content: `
    /*
      * ----------------------------------------------------------------------------
      * IMPORTANT: THIS IS AN AUTO_GENERATED FILE. PLEASE DO NOT MODIFY IT DIRECTLY.
      * ----------------------------------------------------------------------------
      */
    `
  }
}

export const importAndExportBaseTypesPlugin = {
  add: {
    placement: 'prepend',
    content: `
        import * as Types from './base';
        export * from './base';
      `
  }
}

export const importResultTypesPlugin = {
  add: {
    placement: 'prepend',
    content: `
        import * as Types from './types';
      `
  }
}

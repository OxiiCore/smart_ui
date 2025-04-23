// Dynamic remote module loader
type ModuleLoaderType = () => Promise<any>;

// Remote module map
const remoteModules: Record<string, ModuleLoaderType> = {
  home: () => import('home/Home'),
  submission: () => import('submission/Submission'),
  form: () => import('form/Form'),
  record: () => import('record/Record')
};

// Function to load remote module
export async function loadRemote(name: string): Promise<any> {
  try {
    return await remoteModules[name]();
  } catch (error) {
    console.error(`Error loading remote module '${name}':`, error);
    throw error;
  }
}

// Load specific page from a module
export async function loadPage(module: string, pageName: string = 'default'): Promise<React.ComponentType<any>> {
  try {
    const moduleExports = await loadRemote(module);
    return moduleExports[pageName] || moduleExports.default;
  } catch (error) {
    console.error(`Error loading page '${pageName}' from module '${module}':`, error);
    throw error;
  }
}
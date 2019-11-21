import dataTypePlugin from './DataTypePlugin'
import typeIsPlugin from './TypeIsPlugin'
import searchBodyPlugin from './SearchBodyPlugin'

export { default as basePlugin } from './BasePlugin'
 
export default [ typeIsPlugin(), dataTypePlugin(), searchBodyPlugin() ]
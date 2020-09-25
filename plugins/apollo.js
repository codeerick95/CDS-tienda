import { appConfig } from '../env'

export default function(){
  return {
    httpEndpoint: appConfig.graphUrl,
    inMemoryCacheOptions: {
      addTypename: false
    }
  }
}
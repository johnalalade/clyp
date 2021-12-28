import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
axios.defaults.baseURL = 'https://clyp-solutio.herokuapp.com/'
axios.defaults.headers.common = {'Authorization': `Bearer ${AsyncStorage.getItem('token')}`}
export default axios;
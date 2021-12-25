import { createStackNavigator } from 'react-navigator-stack';
import { createAppContainer } from 'react-navigation';
import Fiat from '../Screens/Fiat';
import Crypto from '../Screens/Crypto';
import Signup from '../Screens/Signup';
import Login from '../Screens/Login';

const Screens ={
    Welcome: { screen: Login },
    Signup: { screen: Signup},
    Home: { screen: Fiat },
    Crypto: { screen: Crypto }
}

const MoneyStack = createStackNavigator(Screens)

export default createAppContainer(MoneyStack)
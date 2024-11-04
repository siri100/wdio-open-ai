import { ai} from '../helper/exeCMD.ts';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));
let platform = argv['platform'];

describe('My Login application', () => {
    it('should login with valid credentials', async () => {
        console.log(platform)
        if(platform==='web'){
            await driver.url('https://www.saucedemo.com/v1/')
            await driver.pause(4000)
        }else{
            console.log("Skip")
        }
        await ai(`User want to fill "username" field with "standard_user"`);
        await ai(`User want to fill "password" field with "secret_sauce"`);
        await ai(`User click "LOGIN" button`);
        await ai(`User adds first item to cart`);
        await ai(`User navigates to my shopping-cart`);
        await ai(`User validates item is added to cart with expected text "Sauce Labs Backpack"`);
    })
})


import Account from "../models/Account.js";
import Service from "../models/Service.js";

export function generateCustomerId(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const random7digits = String(Math.floor(1000000 + Math.random() * 9000000));

  return `${year}${month}${day}${random7digits}`;
}

export async function validateCustomerId(customerId){

  const validateAccountId = await Account.findOne({ where: { customerId: customerId }});
  const validateServiceId = await Service.findOne({ where: { customerId: customerId }});

  if(validateAccountId || validateServiceId) {
    return false;
  }
  return true;
}

export async function createCustomerId(){  
  let customerId;
  let customerIdAvailable = false;
  
  while(!customerIdAvailable){
      customerId = generateCustomerId(new Date());
      customerIdAvailable = await validateCustomerId(customerId);
      if(!customerIdAvailable){
        console.log("CustomerId is taken")
      }
  }
  return customerId;
}
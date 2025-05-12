<script setup>
import { reactive, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { Form } from '@primevue/forms';

import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import IftaLabel from 'primevue/iftalabel';
import Checkbox from 'primevue/checkbox';
import Password from 'primevue/password';
import Message from 'primevue/message';

import RepositoriesFactory from '../../apis/repositories/RepositoriesFactory';
const respository = RepositoriesFactory.get('CreateAccountRepository');

const dialogPrivacyPolicy = ref(false);
const dialogSuccess = ref(false);

const items = reactive({
  username: '',
  email: '',
  password: '',
  verifyPassword: '',
  phone: '',
  privacyFlag: ''
})

const resolver = ({ values }) => {
    const errors = {};

    if (!values.email) {
        errors.email = [{ message: 'Email is required.' }];
    }
    if (!values.username) {
        errors.username = [{ message: 'Username is required.' }];
    }
    if (!values.password) {
        errors.password = [{ message: 'Password is required.' }];
    }
    if (!values.verifyPassword) {
        errors.verifyPassword = [{ message: 'Verify Password is required.' }];
    }
    if (!values.phone) {
        errors.phone = [{ message: 'Phone is required.' }];
    }
    return {
        values, 
        errors
    };
};

async function onSubmit({ valid }) {
  if (!valid) {
    return console.log("Please fill required fields");
  }
  
  if(items.privacyFlag == true){
    items.privacyFlag = 'Y';
  } else {
    items.privacyFlag = 'N';
  }
  console.log('Username: ', items.username);
  console.log('Email: ', items.email);
  console.log('Password: ', items.password);
  console.log('Verify Password: ', items.verifyPassword);
  console.log('Phone: ', items.phone);
  console.log('Privacy Flag: ', items.privacyFlag);
  console.log('Request: ', JSON.stringify(items));
  try {
    const response = await respository.create(items);
    console.log("Response: ", response);
    if(response.status === 200){
      dialogSuccess.value = true;

    }
  } catch (error) {
    console.error("Error: "+ error);
  }
}
</script>

<template>
    <div class="wrapper">
        <section class="createaccountpage">
            <div class="createaccountform">
                <h1>Create an account to visualize dream rooms</h1>
                <Form v-slot="$form" :value="items" :resolver="resolver" method="POST" @submit="onSubmit">
                  <IftaLabel class="formusername">
                    <InputText id="email" name="email" v-model="items.email"/><label for="email">Email:</label>
                    <Message class="p-message-text" v-if="$form.email?.invalid" severity="error" variant="simple">{{ $form.email.error.message }}</Message>
                  </IftaLabel>
                  <IftaLabel class="formusername">
                    <InputText id="username" name="username" v-model="items.username"/><label for="username">Username:</label>
                    <Message class="p-message-text" v-if="$form.username?.invalid" severity="error" variant="simple">{{ $form.username.error.message }}</Message>
                  </IftaLabel>
                  <IftaLabel class="formpassword">
                    <Password v-model="items.password" name="password" inputId="password" variant="filled" toggleMask/><label for="password">Password</label>
                    <Message class="p-message-text" v-if="$form.password?.invalid" severity="error" variant="simple">{{ $form.password.error.message }}</Message>
                  </IftaLabel>
                  <IftaLabel class="formpassword">
                    <Password v-model="items.verifyPassword" name="verifyPassword" inputId="verifyPassword" variant="filled" toggleMask/><label for="verifyPassword">Verify Password</label>
                    <Message class="p-message-text" v-if="$form.verifyPassword?.invalid" severity="error" variant="simple">{{ $form.verifyPassword.error.message }}</Message>
                  </IftaLabel>
                  <IftaLabel class="formpassword">
                    <InputText id="phone" name="phone" v-model="items.phone"/><label for="phone">Phone:</label>
                    <Message class="p-message-text" v-if="$form.phone?.invalid" severity="error" variant="simple">{{ $form.phone.error.message }}</Message>
                  </IftaLabel>

                  <div class="permissionFlag">
                    <Checkbox v-model="items.privacyFlag" :invalid="!items.privacyFlag" binary />
                    <p>I accept with this</p>
                    <label @click="dialogPrivacyPolicy = true">Privacy Terms</label>
                    <Dialog v-model:visible="dialogPrivacyPolicy" modal header="Privacy Policy for Room Visualizer" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                      <p style="font-size: 18px; padding-bottom: 10px;">Effective Date: 1 May 2025</p>
                      <p style="font-size: 18px; padding-bottom: 3px;">1. Introduction</p>
                      <p style="font-size: 15px; padding-bottom: 10px; padding-left: 20px;">
                        Room Visualizer ("we," "our," or "us") is committed to protecting the privacy of our users. 
                        we are dedicated to safeguarding the privacy and personal information of our users. 
                        This Privacy Policy outlines the types of information we collect, how we use and protect that information, and the choices you have regarding your personal data.
                        By accessing or using our services, you agree to the terms outlined in this policy. 
                        Our commitment to privacy stems from our respect for your personal data and our desire to maintain your trust. We understand the importance of transparency and aim to provide clear information about our data practices. 
                        This policy applies to all users of our services, including visitors to our website and subscribers to our platform. We encourage you to read this policy thoroughly to understand how we handle your information. 
                        If you have any questions or concerns, please contact us using the information provided at the end of this document.
                      </p>
                      <p style="font-size: 18px; padding-bottom: 3px;">2. Information We Collect</p>
                      <p style="font-size: 15px; padding-bottom: 10px; padding-left: 20px;">
                        We collect various types of information to provide and improve our services. 
                        When you register for an account, we collect personal identification information such as your name, email address, phone number, and other contact details. 
                        We also gather account information, including your username, password, and other credentials necessary for authentication and account management. 
                        Additionally, we collect usage data, which encompasses information about how you interact with our services, such as access times, pages viewed, and diagnostic data. 
                        This information helps us understand user behavior and preferences, enabling us to enhance the user experience. 
                        We may also collect information through cookies and similar tracking technologies to personalize content and analyze site traffic.
                        All collected data is handled in accordance with this Privacy Policy.
                      </p>
                      <p style="font-size: 18px; padding-bottom: 3px;">3. Use of Information</p>
                      <p style="font-size: 15px; padding-bottom: 10px; padding-left: 20px;">
                        The information we collect is utilized for various purposes to ensure the effective delivery and improvement of our services. 
                        Primarily, we use your personal information to create and manage your account, provide customer support, and deliver the services you request. 
                        We also analyze user behavior and preferences to improve our services and develop targeted marketing strategies. 
                        This analysis helps us understand market trends and user needs, allowing us to tailor our offerings accordingly. 
                        Additionally, we may use your information to communicate with you about updates, promotional materials, and other information related to our services. 
                        These communications aim to keep you informed about new features, special offers, and other relevant content.
                        We ensure that all uses of your information are consistent with this Privacy Policy and applicable laws.
                      </p>
                      <p style="font-size: 18px; padding-bottom: 3px;">4. Sharing of Information</p>
                      <p style="font-size: 15px; padding-bottom: 10px; padding-left: 20px;">
                        We may share your information under specific circumstances to facilitate our operations and enhance our services. 
                        Your information may be shared with our parent company and affiliated entities for purposes consistent with this Privacy Policy, including marketing analysis and service improvements. 
                        These entities are bound by confidentiality obligations and are required to handle your information responsibly.
                        We may also engage third-party service providers to perform functions on our behalf, such as data analysis, marketing, and customer service. 
                        These providers have access to your information only to the extent necessary to perform their functions and are obligated to maintain its confidentiality. 
                        Additionally, we may disclose your information if required by law or in response to valid requests by public authorities.
                      </p>
                      <p style="font-size: 18px; padding-bottom: 3px;">5. Data Security</p>
                      <p style="font-size: 15px; padding-bottom: 10px; padding-left: 20px;">
                        We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, use, or disclosure. 
                        These measures include encryption, access controls, and secure data storage practices. 
                        Our security protocols are designed to safeguard your data during transmission and storage. 
                        However, no method of transmission over the internet or electronic storage is completely secure. 
                        While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security. 
                        We encourage you to take precautions to protect your personal information, such as using strong passwords and logging out of your account when not in use. 
                        In the event of a data breach, we will notify affected users in accordance with applicable laws.
                      </p>
                      <p style="font-size: 18px; padding-bottom: 3px;">6. Your Rights and Choices</p>
                      <p style="font-size: 15px; padding-bottom: 10px; padding-left: 20px;">
                        Depending on your location, you may have certain rights regarding your personal information. 
                        These rights may include the ability to access, correct, or delete your personal data. 
                        You may also have the right to object to or restrict certain processing activities. 
                        To exercise these rights, please contact us using the information provided at the end of this policy. 
                        Additionally, you may opt-out of receiving promotional communications from us by following the unsubscribe instructions included in our emails. 
                        Please note that even if you opt-out of receiving marketing communications, we may still send you transactional 
                        or administrative messages related to your account or our services. We are committed to respecting your privacy rights and will respond to your requests in accordance with applicable laws.
                      </p>
                      <p style="font-size: 18px; padding-bottom: 3px;">7. International Transfers</p>
                      <p style="font-size: 15px; padding-bottom: 10px; padding-left: 20px;">
                        Your information may be transferred to and maintained on servers located outside of your jurisdiction, where data protection laws may differ. 
                        We take steps to ensure that your data is treated securely and in accordance with this Privacy Policy. 
                        When transferring personal data internationally, we implement appropriate safeguards, such as standard contractual clauses or other legal mechanisms, to protect your information. 
                        By using our services, you consent to the transfer of your information to countries outside of your country of residence. 
                        We are committed to protecting your personal data regardless of where it is processed or stored.
                      </p>
                      <p style="font-size: 18px; padding-bottom: 3px;">8. Changes to This Privacy Policy</p>
                      <p style="font-size: 15px; padding-bottom: 10px; padding-left: 20px;">
                        We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, legal requirements, or other factors.
                        When we make changes, we will revise the "Effective Date" at the top of this policy and, in some cases, provide additional notice. 
                        We encourage you to review this policy periodically to stay informed about how we are protecting your information. 
                        Your continued use of our services after any changes to this policy constitutes your acceptance of the updated terms.
                      </p>
                      <p style="font-size: 18px; padding-bottom: 3px;">9. Contact Us</p>
                      <p style="font-size: 15px; padding-bottom: 10px; padding-left: 20px;">
                        If you have any questions or concerns about this Privacy Policy, please contact us at:
                      </p>
                      <p style="font-size: 15px; padding-top: 40px; padding-right: 40px; padding-bottom: 10px; display: flex; justify-content: flex-end;">Sincerely,</p>
                      <p style="font-size: 15px; padding-right: 40px; display: flex; justify-content: flex-end;">Teerapat Kongrit</p>
                      <p style="font-size: 15px; font-weight: 600; padding-right: 40px; padding-bottom: 10px; display: flex; justify-content: flex-end;">Room Visualizer Creater</p>
                    </Dialog>
                  </div>

                  <Button type="submit" label="Create Account" severity="primary" />
                  <Dialog v-model:visible="dialogSuccess" modal header="Success" :style="{ width: '770px' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                    <p class="m-0">
                        Congratulations🎉🎉🎉 You have create account successfully. Please verify your email and get Start!!!
                    </p>
                  </Dialog>
                  <div class="checkaccount">
                    Aleady have an account? <RouterLink to="/login">Log in</RouterLink>
                  </div>
                </Form>
            </div>
        </section>
    </div>
</template>
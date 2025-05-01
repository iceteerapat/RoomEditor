<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import IftaLabel from 'primevue/iftalabel';
import Checkbox from 'primevue/checkbox';
import Password from 'primevue/password';

import axios from 'axios';

const username = ref('')
const email = ref('')
const password = ref('')
const phone = ref('')
const privacyFlag = ref(false)
const dialogSuccess = ref(false);
const dialogPrivacyPolicy = ref(false)

const handleSubmit = () => {
  console.log('Username: ', username.value)
  console.log('Email: ', email.value)
  console.log('Password: ', password.value)
  console.log('Phone: ', phone.value)
  console.log('Privacy: ', privacyFlag.value)
}
</script>

<template>
    <div class="wrapper">
        <section class="createaccountpage">
            <div class="createaccountform">
                <h1>Create an account to visualize dream rooms</h1>
                <form @submit.prevent="handleSubmit">

                  <IftaLabel class="formusername">
                    <InputText id="email" v-model="email" :invalid="!value"/>
                    <label for="email">Email:</label>
                  </IftaLabel>
                  <IftaLabel class="formusername">
                    <InputText id="username" v-model="username" :invalid="!value"/>
                    <label for="username">Username:</label>
                  </IftaLabel>
                  <IftaLabel class="formpassword">
                    <Password v-model="password" inputId="password" variant="filled" :invalid="!value" toggleMask/>
                    <label for="password">Password</label>
                  </IftaLabel>
                  <IftaLabel class="formpassword">
                    <InputText id="phone" v-model="phone" :invalid="!value"/>
                    <label for="phone">Phone:</label>
                  </IftaLabel>

                  <div class="permissionFlag">
                    <Checkbox v-model="privacyFlag" :invalid="!privacyFlag"  binary />
                    <p>I accept with this</p>
                    <label @click="dialogPrivacyPolicy = true">Privacy Terms</label>
                    <Dialog v-model:visible="dialogPrivacyPolicy" modal header="Privacy Policy for Room Visualizer" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                      <p>Effective Date: 1 May 2025</p>
                      <p>
                        1. Introduction
                        Room Visualizer ("we," "our," or "us") is committed to protecting the privacy of our users. 
                        This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use our services. 
                        By accessing or using our services, you agree to the terms of this Privacy Policy.
                      </p>
                      <p>
                        2. Information We Collect
                        We may collect personal information that you voluntarily provide to us when registering for our services, such as:
                          Personal Identification Information: Name, email address, phone number, and other contact details.
                          Account Information: Username, password, and other credentials.
                          Usage Data: Information about how you use our services, including access times, pages viewed, and other diagnostic data.
                      </p>
                      <p>
                        3. Use of Information
                        We use the collected information for various purposes, including:
                        Providing and Maintaining Services: To create and manage your account, provide customer support, and deliver requested services.
                        Marketing Analysis: To analyze user behavior and preferences to improve our services and develop targeted marketing strategies.
                        Communication: To send you updates, promotional materials, and other information related to our services.
                      </p>
                      <p>
                        4. Sharing of Information
                        We may share your information in the following circumstances:
                        With Parent and Affiliated Companies: We may share your information with our parent company and affiliates for purposes consistent with this Privacy Policy, including marketing analysis and service improvements.
                        Service Providers: We may engage third-party companies to perform services on our behalf, such as data analysis, marketing, and customer service. These third parties are obligated to maintain the confidentiality of your information.
                        Legal Requirements: We may disclose your information if required to do so by law or in response to valid requests by public authorities.
                      </p>
                      <p>
                        5. Data Security
                        We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, use, or disclosure. 
                        However, no method of transmission over the internet or electronic storage is completely secure.
                      </p>
                      <p>
                        6. Your Rights and Choices
                        Depending on your location, you may have certain rights regarding your personal information, including:
                        Access and Correction: You may request access to or correction of your personal information.
                        Opt-Out: You may opt-out of receiving promotional communications from us by following the unsubscribe link in our emails.
                      </p>
                      <p>
                        7. International Transfers
                        Your information may be transferred to and maintained on servers located outside of your jurisdiction, where data protection laws may differ. 
                        We take steps to ensure that your data is treated securely and in accordance with this Privacy Policy.
                      </p>
                      <p>
                        8. Changes to This Privacy Policy
                        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on our website and updating the "Effective Date" at the top.
                      </p>
                      <p>
                        9. Contact Us
                        If you have any questions or concerns about this Privacy Policy, please contact us at:
                      </p>
                    </Dialog>
                  </div>
                  
                  <Button type="submit" label="Create Account" @click="dialogSuccess = true" severity="primary" />
                  <Dialog v-model:visible="dialogSuccess" modal header="Success" :style="{ width: '770px' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                    <p class="m-0">
                        Congratulations🎉🎉🎉 You have create account successfully. Please try login!
                    </p>
                  </Dialog>
                  <div class="checkaccount">
                    Aleady have an account? <RouterLink to="/login">Log in</RouterLink>
                  </div>
                </form>
            </div>
        </section>
    </div>
</template>
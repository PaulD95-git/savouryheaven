# Reservation System

## Live Demo & Repository

- **Live Application**: [View Live Site](https://savouryheaven-15fa27504aa2.herokuapp.com/)
- **GitHub Repository**: [View Source Code](https://github.com/PaulD95-git/savouryheaven)


## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
  - [Seamless Table Booking](#seamless-table-booking)
  - [Manage Reservations (Cancel/Edit)](#manage-reservations-canceledit)
  - [Secure User Authentication (Login)](#secure-user-authentication-login)
  - [Easy Account Creation (Signup)](#easy-account-creation-signup)
  - [Comprehensive Admin Dashboard](#comprehensive-admin-dashboard)
  - [Fully Responsive Design](#fully-responsive-design)
  - [Digital Menu](#digital-menu)
  - [About Us Page](#about-us-page)
  - [Contact Page](#contact-page)
- [Technologies Used](#technologies-used)
- [Testing](#testing)
- [Deployment](#deployment)
- [Bugs and Solutions](#bugs-and-solutions)
- [Acknowledgements](#acknowledgements)

---

## Project Overview

Savoury Heaven is a sophisticated restaurant website featuring an online booking system and digital menu. The platform provides customers with an elegant way to explore our culinary offerings, make reservations, and experience fine dining from the comfort of their homes before even visiting our physical location.


---

## Features

### 1. **Seamless Table Booking**
   - **Intuitive Interface**: Browse available time slots with a dynamic, user-friendly calendar and time selector. The system instantly updates available slots based on the restaurant's capacity and existing bookings.
   - **Flexible Booking Options**: Specify the number of guests, choose your preferred date and time, and add any special requests or dietary requirements (e.g., high chair, allergies) to ensure the restaurant is prepared for your visit.
   - **Instant Confirmation**: Receive immediate on-screen confirmation with a summary of your reservation details upon successful booking.

   ![Booking a Table](static/images/readme/booking_table.JPG)
   ![Booking a Table](static/images/readme/booking_table2.JPG)
   ![Booking a Table](static/images/readme/booking_table3.JPG)
   ![Booking a Table](static/images/readme/booking_success.JPG)

### 2. **Manage Reservations (Cancel/Edit)**
   - **User Control**: Users have a dedicated dashboard to view all their upcoming and past reservations. This provides a single, convenient location to manage all booking-related activities.
   - **Easy Modifications**: Need to change the time, date, or number of guests? The edit feature allows users to update their reservation details effortlessly, subject to availability.
   - **Hassle-Free Cancellations**: Cancel reservations with a single click. A confirmation dialog prevents accidental cancellations.

   ![Reservation](static/images/readme/reservations_page.JPG)
   ![Reservation](static/images/readme/reservations_page2.JPG)
   ![Cancel/Edit Reservation](static/images/readme/cancel_booking.JPG)
   ![Cancel/Edit Reservation](static/images/readme/edit_booking.JPG)

### 3. **Secure User Authentication (Login)**
   - **Protected Accounts**: Users can securely log in to their personal accounts using encrypted credentials, ensuring their personal data and reservation history remain private.
   - **Password Recovery**: A streamlined "Forgot Password" feature allows users to securely reset their password via email, ensuring they never lose access to their account.

   ![Login](static/images/readme/login.JPG)


### 4. **Easy Account Creation (Signup)**
   - **Quick Registration**: New users can create an account in moments by providing essential information. This process is designed for maximum efficiency and a minimal number of steps.
   - **Email Verification**: A confirmation email is sent upon registration to verify the user's email address, enhancing security and reducing the chance of fake or erroneous accounts.

   ![Signup](static/images/readme/signup.JPG)


### 5. **Comprehensive Admin Dashboard**
   - **Centralized Management**: Admins have access to a powerful dashboard that serves as the command center for all restaurant operations.
   - **View All Reservations**: Get a complete, real-time overview of all bookings, filtered by date, to easily manage daily covers and plan seating arrangements.
   - **Manage Users**: Administrators can view, edit, or deactivate user accounts, maintaining the platform's integrity and user base.
   - **Manage Reservations**: Admins have the authority to modify, cancel, or add notes to any reservation, providing the flexibility to handle customer service inquiries and special requests directly.

   ![Admin Dashboard](static/images/readme/admin.JPG)


### 6. **Fully Responsive Design**
   - **Accessibility on Any Device**: The application is built with a mobile-first approach, ensuring a flawless and consistent user experience whether accessed from a desktop, tablet, or smartphone. Customers can book a table on the go with ease.

   ![Responsive Design](static/images/readme/responsive.JPG)

### 7. **Digital Menu**
   - **Discover Offerings**: A beautifully presented digital menu allows users to browse the restaurant's culinary offerings, including categories, descriptions, and prices, helping them decide to book a table. While on the backend can be completely be controlled by staff not having to write any code.

   ![Menu](static/images/readme/menu.JPG)


### 8. **About Us Page**
   - **Our Story**: This section introduces the restaurant's history, ethos, and team, helping to build a connection with potential customers before they even step through the door.

   ![About](static/images/readme/about.JPG)


### 9. **Contact Page**
   - **Get in Touch**: Provides essential contact information such as the restaurant's address, phone number, and operating hours. It also often includes a contact form for direct inquiries that aren't covered by reservations.

   ![Contact](static/images/readme/contact.JPG)

---

## Technologies Used

- **Backend**: Django (Python)
- **Frontend**: HTML, CSS, Bootstrap 5
- **Database**: SQLite (for local development), PostgreSQL (for production)
- **Authentication**: Django Allauth
- **Hosting**: Heroku for deployment

---

## Testing

### Manual Testing
Test all user stories, including:
- **User registration, login, and password recovery**: Ensure users can successfully register, log in, and recover their passwords.
- **Making, viewing, and canceling reservations**: Test the process of creating, viewing, and canceling reservations.
- **Admin managing users and reservations**: Verify that the admin can view and manage all users and reservations effectively.

### Automated Testing
Tests are written for key parts of the application such as:
- **User authentication**: Test the functionality of user sign-up, login, and password recovery.
- **Reservation creation and management**: Test the process of creating, viewing, and canceling reservations.

---

## Deployment

This guide walks through deploying the application using Heroku's web-based dashboard.

## Prerequisites
*   A [Heroku account](https://signup.heroku.com/)
*   Your code pushed to a **GitHub** repository

## Deployment Steps

1.  **Connect GitHub**
    *   Go to the [Heroku Dashboard](https://dashboard.heroku.com/apps) and click **Create new app**.
    *   Give your app a unique name and choose a region.
    *   In your new app's **Deploy** tab, under "Deployment method", select **GitHub** and connect your account. Authorize Heroku to access your repository.

2.  **Configure Automatic Deploys (Optional)**
    *   In the same **Deploy** tab, search for and connect your GitHub repository.
    *   You can choose **Enable Automatic Deploys** to have Heroku rebuild your app every time you push to your main branch.

3.  **Set Config Vars (Environment Variables)**
    *   Navigate to the **Settings** tab for your app.
    *   Click **Reveal Config Vars**.
    *   Add the following keys and their values:
        *   `SECRET_KEY`: (Your Django secret key)
        *   `DEBUG`: `False`

4.  **Add a Database**
    *   In the **Resources** tab, search for "Heroku Postgres" in the Add-ons search bar.
    *   Select "Heroku Postgres" and choose the free **Mini** plan to add it to your app. This automatically sets the `DATABASE_URL` config var.

5.  **Deploy the App**
    *   Go back to the **Deploy** tab.
    *   If you enabled automatic deploys, your app will already be building. Otherwise, scroll to the bottom and click **Deploy Branch** in the "Manual deploy" section.
    *   Watch the build logs to ensure there are no errors.

6.  **Run Migrations & Create Superuser**
    *   After deployment, go to the **Resources** tab.
    *   In the "Worker" dyno section, click the edit icon (pencil).
    *   Type `python manage.py migrate` into the command field and click **Save**. This will run your database migrations.
    *   (Optional) To create a superuser, you can use Heroku's web console. Go to the **More** dropdown in the top right of your app's dashboard and select **Run console**. Type `python manage.py createsuperuser` and follow the prompts.

7.  **Open Your App**
    *   Once deployed, click the **Open App** button at the top of your Heroku dashboard to view your live site.

Your application is now live at `https://[your-app-name].herokuapp.com`.

---

## Bugs and Solutions

### Bug 1: Time Slot Availability Calculation Issue
**Problem**: Users reported that time slots showed as "No times available" even when there should be available slots. The issue was particularly noticeable with "12 PM" slots that remained available when they should have been marked as past.

**Root Cause**: The JavaScript function `isTimeSlotInPast()` had incorrect logic for handling 12-hour time format conversion, specifically:
- 12 PM (noon) wasn't being properly converted to 24-hour format
- 12 AM (midnight) was incorrectly set to 24:00 instead of 00:00
- Timezone differences between client and server weren't properly handled

**Solution**: 
- Fixed the time conversion logic to properly handle 12 PM/AM
- Used proper Date object comparisons instead of minute calculations
- Added timezone-aware date handling
- Implemented a 30-minute buffer to prevent last-minute bookings

---

## Acknowledgements

- Bootstrap 5 for the responsive frontend framework
- Django community for excellent documentation and resources
- Heroku for providing a reliable deployment platform
- Cloudinary for image management services
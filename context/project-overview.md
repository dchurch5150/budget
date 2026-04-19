# Budget - Project Overview

> **One app to view budget activities.** Contains transaction history for budgeting as well as monthly and yearly budgeting goals/progress.

## The Problem

Different bank accounts, credit cards, investment accounts scatter total expenses and incomes. Requires different locations to view all transactions.

**Budget** consolidates all this with a single fast app that can ingest different sources into a single view.

## Tech Stack

| Layer     | Technology        |
| --------- | ----------------- |
| Framework | React and Next.js |
| Database  | Postgresql        |

## Transaction Types

Every transaction is a **Type**. The types are:

| Type     | Description                                                              |
| -------- | ------------------------------------------------------------------------ |
| Income   | Money received. Can be from a paycheck, dividend/interest, etc.          |
| Expenses | Money paid. Examples are groceries, utilities, housing, etc.             |
| Savings  | Money set aside. Can be for emergency savings, investment accounts, etc. |

## Type Categories

Each of the three types are assigned a category to help classify the type. For example, Employment (Net) would be an Income category that represents income received from a standard paycheck. Groceries is an example of an Expenses category. Emergency Fund is an example of Savings category.

The following are the out of the box categories we are considering, but the app can add custom categories.

| Category           | Type     | Description                                                                          |
| ------------------ | -------- | ------------------------------------------------------------------------------------ |
| Employment (Net)   | Income   | Money received from a standard W-2 type paycheck                                     |
| Side Hustle        | Income   | Money recevied from a side gig. Not necessarily consistent                           |
| Dividends          | Income   | Dividend payments from stocks                                                        |
| Interest           | Income   | Interest payments from savings accounts                                              |
| Options Premium    | Income   | Option premiums when selling an option.                                              |
| Housing            | Expenses | Money paid for housing, such as mortgage, property taxes, etc.                       |
| Utilities          | Expenses | Electricity, phone, etc.                                                             |
| Groceries          | Expenses | Money spent on food.                                                                 |
| Transportation     | Expenses | Money spent on gas, car payments, public transportation, etc.                        |
| Insurance          | Expenses | Insurance not covered by Transporation or Medical or Housing, such as pet insurance. |
| Clothing           | Expenses | Money spent on clothes.                                                              |
| Medical            | Expenses | Doctor visits, medications, dental visits.                                           |
| Media              | Expenses | Electronic media or subscriptions                                                    |
| Fun & Vacation     | Expenses | Non-essentials, such as vacations, video games, etc.                                 |
| Home Office        | Expenses | Work related expenses                                                                |
| Charity            | Expenses | Charity                                                                              |
| Gifts              | Expenses | Gifts for others, such as birthdays and Christmas                                    |
| Margin             | Expenses | Interest payments on loans                                                           |
| Taxes              | Expenses | Any extra tax payments                                                               |
| Emergency Fund     | Savings  | Money saved aside for an emergency                                                   |
| Retirement Account | Savings  | Tax efficient accounts, such as 401k, IRA, etc.                                      |
| Brokerage Account  | Savings  | Taxed stock accounts                                                                 |
| Crypto             | Savings  | A crypto account                                                                     |
| Sinking Fund       | Savings  | Long term savings not designated as an emergency                                     |
| Physical Emergency | Savings  | Money held in physical cash                                                          |

## Tags

A transaction can have multiple tags associated with it to help further classify the transaction. Safeway could be a tag on a Groceries transaction to help further show which store the Groceries were purchased from. May want a tag to differentiate between a monthly subscription vs an annual subscription.

## Features

The app has the following features:

### Budget Planning

This page a user can enter what they expect to send/receive for each category per month. A totals row will show whether or not it would put them over budget based on the income minus expenses and savings, and this will be shown for both the months and the total year.

### Budget Tracking

The main page where a user can insert a transcation. Will be displayed in a table style with the following columns:

- Date
- Type
- Category
- Amount
- Tags
- Details
- Balance
- Source

A running balance will show how much was available at each transaction, as well as a total tracking how over/under budget the user is.

### Budget Dashboard

A single page dashboard to visually see how the budget is performing. The dashboard will have two parameters to control the data shown: `Year` and `Period`. Year filters the transaction data to a specific year. Period filters down to a specific period in the selected year. The period can either be a month, or the whole year.

Some of the dashboard features includes:

- An itemized breakdown showing how on track a category is for the specified period.
- Circle graphs for each type that shows percentages based on category

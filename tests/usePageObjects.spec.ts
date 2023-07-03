import { test, expect } from '@playwright/test'
import { NavigationPage } from '../page-objects/navigationPage'
import { FormLayoutsPage } from '../page-objects/formLayoutsPage'
import { DatepickerPage } from '../page-objects/datepickerPage'

test.beforeEach( async ({page}) => {
    await page.goto('http://localhost:4200')
})


test('navigation test', async ({page}) => {
    const navigateTo = new NavigationPage(page)
    await navigateTo.formLayoutsPage()
    await navigateTo.datePickerPage() 
    await navigateTo.smartTablePage()
    await navigateTo.toastrPage()
    await navigateTo.tooltipPage()   
})

test('parametrized methods', async({page}) => {
    const navigateTo = new NavigationPage(page)
    const onFormLayoutsPage = new FormLayoutsPage(page)
    const onDatepickerPage = new DatepickerPage(page)

    await navigateTo.formLayoutsPage()
    await onFormLayoutsPage.submitUsingTheGridFormWithCredentialsAndSelectOption('test@test.com', 'password', 'Option 1')
    await onFormLayoutsPage.submitInlineFormWithNameEmailAndCheckbox('John Smith', 'JohnSmith@test.com', false)
    await navigateTo.datePickerPage()
    await onDatepickerPage.selectCommonDatePickerDateFromToday(5)
    await onDatepickerPage.selectDatepickerWithRangeFromToday(6, 10)
})

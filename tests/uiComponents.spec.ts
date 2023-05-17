import { test, expect } from '@playwright/test'

test.beforeEach( async({page}) => {
    await page.goto('http://localhost:4200')
})

test.describe('Form Layouts page', () => {
    test.beforeEach( async ({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('input field', async({page}) => {
        const usingGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})

        await usingGridEmailInput.fill('test@test.com') //fill out the value
        await usingGridEmailInput.clear()
        await usingGridEmailInput.type('test2@test.com', {delay: 500}) //simulate the key strokes

        // assertions of the values
        //general assertion
        const inputValue = await usingGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@test.com')

        //Locator assertion
        await expect(usingGridEmailInput).toHaveValue('test2@test.com')
    })

    test('radio buttons', async({page}) => {
        const usingTheGridCard = page.locator('nb-card', {hasText: "Using the Grid"})

        await usingTheGridCard.getByLabel('Option 1').check({force: true})
        await usingTheGridCard.getByRole('radio', {name: "Option 1"}).check({force: true})
        expect(await usingTheGridCard.getByLabel('Option 1').isChecked()).toBeTruthy()
        
        await usingTheGridCard.getByLabel('Option 2').check({force: true})
        expect(await usingTheGridCard.getByLabel('Option 1').isChecked()).toBeFalsy()
        expect(await usingTheGridCard.getByLabel('Option 2').isChecked()).toBeTruthy()
    })
})

test.describe('Toaster page', () => {
    test.beforeEach( async ({page}) => {
        await page.getByText('Modal & Overlays').click()
        await page.getByText('Toastr').click()
    })

    test('checkboxes', async({page}) => {
        // check vs uncheck vs click
        await page.getByRole('checkbox', {name: 'Hide on click'}).uncheck({force: true})
        await page.getByRole('checkbox', {name: 'Prevent arising of duplicate toast'}).check({force: true})

        //check all buttons
        const allBoxes = page.getByRole('checkbox')
        for (const box of await allBoxes.all()){
            await box.uncheck({force: true})
            expect(await box.isChecked()).toBeFalsy()
        }

    })
})

test('Lists and Dropdown', async ({page}) => {

    const dorpDownMenu = page.locator('ngx-header nb-select')
    await dorpDownMenu.click()

    page.getByRole('list') // when the list has a UL tag
    page.getByRole('listitem') //the the list has LI tag

    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    await optionList.filter({hasText: "Cosmic"}).click()
    await expect(dorpDownMenu).toHaveText("Cosmic")
    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }

    await dorpDownMenu.click()
    
    for(const color in colors){
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if(color != "Corporate")
            await dorpDownMenu.click()
    }
})

test('tooltips', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const toolTipCard = page.locator('nb-card', {hasText: 'Tooltip Placements'})
    await toolTipCard.getByRole('button', {name: "Top"}).hover()

    page.getByRole('tooltip') //if you have a role tooltip created for the tooltip
    const tooltip = await page.locator('nb-tooltip').textContent()
    expect(tooltip).toEqual('This is a tooltip')
})

test('dialog box', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })
    await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click()
    
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
})


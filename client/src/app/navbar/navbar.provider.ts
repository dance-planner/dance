import { INavbarData } from './navbar.interfaces'

// tslint:disable-next-line: no-unnecessary-class
export class NavBarProvider {
  public static getNavBarData(language: string): INavbarData {
    const domain = document.location.toString().split('/')[2]

    return {
      appTitle: (domain === 'localhost:4200') ? 'dance-planner.org' : domain,
      menuEntries: [{
        isActive: true,
        text: 'Find Events',
        href: 'find',
      },
                    {
        isActive: false,
        text: 'Create Events',
        href: 'create',
      },
                    {
        isActive: false,
        text: 'The App',
        href: 'app',
      },
                    {
        isActive: false,
        text: 'Contact',
        href: 'contact',
      }],
    }
  }

}

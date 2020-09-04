import { INavbarData } from 'ng-responsive-navbar'

// tslint:disable-next-line: no-unnecessary-class
export class NavBarProvider {
  public static getNavBarData(language: string): INavbarData {
    const domain = document.location.toString().split('/')[2]

    return {
      logoURL: '../assets/logo.png',
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
        text: 'Find Partners',
        href: 'findDancePartners',
      },
                    {
        isActive: false,
        text: 'Find Tutorials',
        href: 'findTutorials',
      },
                    {
        isActive: false,
        text: 'Find Schools',
        href: 'findSchools',
      },
                    {
        isActive: false,
        text: 'Find Outfits',
        href: 'findOutfits',
      },

      //               {
      //   isActive: false,
      //   text: 'Tutorials',
      //   href: 'tutorials',
      // },
                    {
        isActive: false,
        text: 'Contact',
        href: 'contact',
      }],
    }
  }

}

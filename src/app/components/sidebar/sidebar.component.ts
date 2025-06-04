import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { branch } from 'src/app/shared/interfaces/dashboard';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  currentLang: string = 'ar';
  url = ''


  
  @ViewChild('dropdownRef') dropdownRef!: ElementRef;
  @ViewChild('modalCloseBtn') modalCloseBtn!: ElementRef;

  // Detect clicks outside
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const clickedInside = this.dropdownRef?.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.filteredArr = [];
    }
  }

  nodeSelect = 'Company'
  textError = ''
  addOrEdit = ''
  nameInAr = ''
  nameInEn = ''
  id: any = 0
  submited = false
  wrongError = false
  itemsList: branch[] = []
  originalAllItems: branch[] = []
  filteredArr: any = [];
  filterSelected = 'all'
  color = '#328299'
  selectColor = false;

  filters = {
    'Cities': []
  }

  // treeData = [
  //   {
  //     nameAr: 'رئيسي',
  //     nameEn: 'Master',
  //     expanded: true,
  //     children: [
  //       {
  //         nameAr: 'HR',
  //         nameEn: 'HR',
  //         expanded: true,
  //         children: [
  //           { name: 'Company', nameAr: 'شركات', nameEn: 'Companies', active: true },
  //           { name: 'Nation', nameAr: 'جنسية', nameEn: 'Nationality', active: false },
  //           { name: 'Branch', nameAr: 'فروع', nameEn: 'Branch', active: false },
  //           { name: 'Job', nameAr: 'وظيفة', nameEn: 'Job', active: false },
  //         ]
  //       },
  //       {
  //         name: 'Customer',
  //         nameAr: 'عميل',
  //         nameEn: 'Customer',
  //         expanded: false,
  //         children: [
  //           { name: 'Company1', nameAr: 'شركات', nameEn: 'Companies', active: false },
  //           { name: 'Nation1', nameAr: 'جنسية', nameEn: 'Nationality', active: false },
  //           { name: 'Branch1', nameAr: 'فروع', nameEn: 'Branch', active: false },
  //           { name: 'Job1', nameAr: 'وظيفة', nameEn: 'Job', active: false },
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     nameAr: 'موظفين',
  //     nameEn: 'employees',
  //     expanded: false,
  //     children: [
  //       { name: 'Companies', nameAr: 'شركات', nameEn: 'Companies', active: false },
  //       { name: 'Branches', nameAr: 'فروع', nameEn: 'Branches', active: false },
  //       { name: 'Departments', nameAr: 'ادارات', nameEn: 'Departments', active: false },
  //       { name: 'Sections', nameAr: 'اقسام', nameEn: 'Sections', active: false },
  //       { name: 'Jobs', nameAr: 'وظائف', nameEn: 'Jobs', active: false },
  //       { name: 'Qualifications', nameAr: 'مؤهلات', nameEn: 'Qualifications', active: false },
  //       { name: 'Religions', nameAr: 'ديانات', nameEn: 'Religions', active: false },
  //       { name: 'Nationality', nameAr: 'جنسية', nameEn: 'Nationality', active: false },
  //       { name: 'Relatives', nameAr: 'قرابات', nameEn: 'Relatives', active: false },
  //       { name: 'Countries', nameAr: 'بلاد', nameEn: 'Countries', active: false },
  //       { name: 'Cities', nameAr: 'مدن', nameEn: 'Cities', active: false },
  //       { name: 'Sponsors', nameAr: 'كفلاء', nameEn: 'Sponsors', active: false }
  //     ]
  //   }
  // ];

  treeData = [
    {
      nameAr: 'رئيسي',
      nameEn: 'Master',
      expanded: true,
      children: [
        { name: 'Company', nameAr: 'شركات', nameEn: 'Companies', active: true , url : '/companies' },
        { name: 'Nation', nameAr: 'جنسية', nameEn: 'Nationality', active: false  , url : '/nationalities'},
        { name: 'Branch', nameAr: 'فروع', nameEn: 'Branch', active: false , url : '/branches'},
        { name: 'Job', nameAr: 'وظيفة', nameEn: 'Job', active: false , url : '/job-titles' },
        { name: 'Departments', nameAr: 'ادارات', nameEn: 'Departments', active: false },
        { name: 'Sections', nameAr: 'اقسام', nameEn: 'Sections', active: false },
        { name: 'Qualifications', nameAr: 'مؤهلات', nameEn: 'Qualifications', active: false },
        { name: 'Religions', nameAr: 'ديانات', nameEn: 'Religions', active: false },
        { name: 'Relatives', nameAr: 'قرابات', nameEn: 'Relatives', active: false },
        { name: 'Countries', nameAr: 'بلاد', nameEn: 'Countries', active: false },
        { name: 'Cities', nameAr: 'مدن', nameEn: 'Cities', active: false },
        { name: 'Sponsors', nameAr: 'كفلاء', nameEn: 'Sponsors', active: false }
      ]
    }
  ];



  constructor(private translate: TranslateService, private router: Router) { }

  ngOnInit(): void {
    this.url = this.router.url
    this.currentLang = this.translate.currentLang || 'ar';

    this.translate.onLangChange.subscribe(lang => {
      this.currentLang = lang.lang;
    });

    document.getElementById('menuSideBar')?.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const clickedLi = target.closest('li');

      if (clickedLi) {
        // Remove 'active' from all <li> elements inside #menuSideBar
        const allLis = document.querySelectorAll('#menuSideBar li');
        allLis.forEach(li => li.classList.remove('active'));

        // Add 'active' to the clicked <li>
        clickedLi.classList.add('active');
      }
    });


  }






  
  toggleNode(node: any, event?: MouseEvent) {
    console.log('event', event)
    if (node.children?.length) {
      console.log('node', node)
      // It's a parent node -> expand/collapse
      node.expanded = !node.expanded;
    } else {
      if (this.nodeSelect != node.name) {
        // It's a child node -> activate it
        this.clearActive(this.treeData); // clear all active
        node.active = true; // set clicked one active
        this.nodeSelect = node.name
        // this.getAllItems(node.name)
      }
    }

    if (event) {
      event.stopPropagation(); // stop event bubbling
    }
  }


  clearActive(nodes: any[]) {
    for (let node of nodes) {
      if (node.children?.length) {
        this.clearActive(node.children);
      } else {
        node.active = false;
      }
    }
  }

  changeBackground(e: any) {
    this.color = e.color.hex
  }


}

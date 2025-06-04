import { Component, ElementRef, HostListener, Input, QueryList, Renderer2, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';
import { branch } from 'src/app/shared/interfaces/dashboard';
import { ConfigurationService } from 'src/app/shared/services/configuration.service';
import { UpdateDataService } from 'src/app/shared/services/update-data.service';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment'
import { HttpClient } from '@angular/common/http';

declare var $: any;
@Component({
  selector: 'app-definitions',
  templateUrl: './definitions.component.html',
  styleUrls: ['./definitions.component.css']
})
export class DefinitionsComponent {
  constructor(
    private renderer: Renderer2,
    private _http: HttpClient,
    private _FormBuilder: FormBuilder, private _UpdateDataService: UpdateDataService, private _ConfigurationService: ConfigurationService,
    private _Router: Router, private _toaster: ToastrService, private _TranslateService: TranslateService, private _spinner: NgxSpinnerService) { }

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
        { nameAr: 'شركات', nameEn: 'Companies', active: false , url:'/configuration/companies'},
        { nameAr: 'الفروع', nameEn: 'Branches', active: false , url:'/configuration/branches'},
        { nameAr: 'الادارات', nameEn: 'Managements', active: false  , url:'/configuration/management'},
        { nameAr: 'الاقسام', nameEn: 'Departments', active: false , url:'/configuration/departments'},
        { nameAr: 'الوظائف', nameEn: 'Jobs', active: false, url:'/configuration/job' },
        { nameAr: 'المؤهلات', nameEn: 'Qualifications', active: false , url:'/configuration/qualification'},
        { nameAr: 'الديانات', nameEn: 'Religions', active: false  , url:'/configuration/religions' },
        { nameAr: 'الجنسية', nameEn: 'Nationality', active: false, url:'/configuration/nationality' },
        { nameAr: 'القرابات', nameEn: 'Neighbors', active: false  , url:'/configuration/neighbor'},
        { nameAr: 'البلاد', nameEn: 'Countries', active: false , url:'/configuration/countries'},
        { nameAr: 'المدن', nameEn: 'Cities', active: false , url:'/configuration/cities'},
        { nameAr: 'الكفلاء', nameEn: 'Kafils', active: false , url:'/configuration/kafil'}
      ]
    }
  ];

  get currentLang() {
    return this._TranslateService.currentLang
  }

  settingForm: FormGroup = this._FormBuilder.group({
    searchInput: [null],
    deleteSelected: [null],
  })

  url = ''

  ngOnInit(): void {

    this.url =this._Router.url
    let getColor = localStorage.getItem('bg')
    if (getColor) {

    } else {

    }

    // this.getAllItems('Company')
    // this.searchingItems();


    const $button = document.querySelector('#sidebar-toggle') as HTMLElement;
    const $wrapper = document.querySelector('#wrapper') as HTMLElement;
    $button.addEventListener('click', (e) => {
      e.preventDefault();
      $wrapper.classList.toggle('toggled');
    });

  }

  getAllItems(item: any) {
    this.itemsList = []
    this.nodeSelect = item
    this._spinner.show('spinner3')
    this._UpdateDataService.getAllGroubOf(item).subscribe({
      next: (respo) => {
        this._spinner.hide('spinner3')
        console.log(respo);
        this.itemsList = respo
        this.itemsList.forEach((obj: any) => obj.checked = false);
        // this.itemsList = this.itemsList.sort((a, b) => Number(a.id) - Number(b.id))
        this.originalAllItems = this.itemsList
      },
      error: (err) => {
        console.log(err)
        this._spinner.hide('spinner3')

      }
    })
  }


  toggleNode(node: any, event?: MouseEvent) {
    setTimeout(() => {
      this.url = this._Router.url
    }, 10);
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
    this.url = this._Router.url

  }

  changeBackground(e: any) {
    this.color = e.color.hex
  }



  isAnyChecked() {
    return this.itemsList.some((item: any) => item.checked);
  }

  // searchingItems() {
  //   this.settingForm.get('searchInput')?.valueChanges.pipe(debounceTime(300))
  //     .subscribe(value => {
  //       if (value) {
  //         this.itemsList = this.originalAllItems.filter((item) => {
  //           const isArabic = /[\u0600-\u06FF]/.test(value); // التحقق مما إذا كان النص يحتوي على حروف عربية
  //           const searchValue = isArabic ? value : value.toLowerCase(); // إذا كان النص عربي نتركه كما هو

  //           const nameEn = item.nameEn ? item.nameEn.toLowerCase() : '';
  //           const namaAr = item.nameAr ? item.nameAr : ''

  //           return namaAr.includes(value) || nameEn.includes(searchValue) || item.id.includes(value)
  //         });
  //       }
  //       else {
  //         this.itemsList = this.originalAllItems
  //       }
  //     })
  // }





}
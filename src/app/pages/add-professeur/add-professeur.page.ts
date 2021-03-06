import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormControl,FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Professeur } from 'src/app/Models/Professeur';
import { MatiereService } from 'src/app/services/matiere.service';
import { ProfesseurService } from 'src/app/services/professeur.service';

@Component({
  selector: 'app-add-professeur',
  templateUrl: './add-professeur.page.html',
  styleUrls: ['./add-professeur.page.scss'],
})
export class AddProfesseurPage implements OnInit {

  id ;
  btn_txt;
  professeur : Professeur = new Professeur();

  form : FormGroup;
  inputSelect = "ee";

  isSubmitted = false;

  constructor(private activedRoute : ActivatedRoute,
    private profeseeurService : ProfesseurService,
    private router : Router,
    private fromBuilder : FormBuilder,
    private matriereService : MatiereService,
    private loadingController : LoadingController
    ) 
  { 
    //console.log('the id', this.activedRoute.snapshot.paramMap.get('id')); 
    this.id = this.activedRoute.snapshot.paramMap.get('id');
    // this.activedRoute.params.subscribe(
    //   par => this.id = par.id
    // );
    // console.log("Id : ", this.id);

    if (this.id != -1) {
      this.btn_txt = "Update Professeur";
      this.profeseeurService.getProfesseurById(this.id).subscribe(
        data => {
          this.form.setValue(data);
          this.professeur = data;
          console.log("Data ", this.professeur); 
        }
      );
      console.log("Yes");
    }
    else {
      this.btn_txt = "Add Professeur";
      console.log("Non");

    }
  }

  ngOnInit() {
    this.matriereService.getAllMatieres().subscribe();

    this.form = this.fromBuilder.group({ 
      idProf : null, 
      matiereId : [0, [Validators.minLength(1)]],
      firstName : ['', [Validators.required, Validators.minLength(3)]],
      lastName : ['', [Validators.required, Validators.minLength(3)]],
      mail: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]], 
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      matiere : null
    })
  }
  get errorControl() {
  return this.form.controls;
}
  onChange(value){
    this.inputSelect = value.detail.value
    console.log("Selected value", value); 
    console.log("Selected Matiere Id ", this.inputSelect); 
  }

  // Simple loader
  simpleLoader(action: boolean) {
    this.loadingController.create({
        message: 'Loading...'
    }).then((response) => {
        action?response.present():response.dismiss();
    });
  }
  register(form){
    this.loadingController.create({
      message: 'Loading...'
    }).then((response) => {
      response.present();
      let prof = this.form.value
    console.log("Form ", this.form.value);
    //this.professeur.matiereId = this.inputSelect;
    prof.matiereId = this.inputSelect;
    this.profeseeurService.addProfesseur(prof).subscribe(
      data => {
        this.profeseeurService.getAllProfesseurs().subscribe(
          data => {
            console.log("This prof " ,prof);
            this.router.navigate(['/professeur/'])
            response.dismiss()
          }
        );
      }
    );
  });

    
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AreaDeTrabalho } from 'src/app/models/area-de-trabalho.model';
import { AreaDeTrabalhoService } from 'src/app/services/area-de-trabalho.service';
import { AuthService } from 'src/app/services/auth.service';


interface Workspace {
  id: string;
  name: string;
}

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.less']
})
export class CreateUserComponent implements OnInit {
  createUserForm: FormGroup;
  errorMessage: string | null = null;
  workspaces: Workspace[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private areaDeTrabalhoService: AreaDeTrabalhoService
  ) {
    this.createUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      accessLevel: ['level1', Validators.required],
      workspace: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadWorkspaces();
  }

  loadWorkspaces(): void {
    const accessLevel = localStorage.getItem('accessLevel') || 'level1';
    this.areaDeTrabalhoService.getAreasDeTrabalho(accessLevel).subscribe((areasDeTrabalho: AreaDeTrabalho[]) => {
      this.workspaces = areasDeTrabalho.map(area => ({
        id: area.id,
        name: area.titulo, // Supondo que o campo 'title' de AreaDeTrabalho corresponde ao campo 'name' de Workspace
        // Adicione outros campos conforme necessário
      }));
    }, error => {
      console.error('Erro ao carregar áreas de trabalho:', error);
    });
  }

  onSubmit(): void {
    if (this.createUserForm.valid) {
      const { email, password, accessLevel, workspace } = this.createUserForm.value;
      this.authService.registerUser(email, password, accessLevel, workspace)
        .then(() => {
          console.log('Usuário criado com sucesso.');
          this.errorMessage = null;
        })
        .catch(error => {
          console.error('Erro ao criar usuário:', error);
          this.errorMessage = 'Erro ao criar usuário: ' + error.message;
        });
    } else {
      this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
    }
  }
}

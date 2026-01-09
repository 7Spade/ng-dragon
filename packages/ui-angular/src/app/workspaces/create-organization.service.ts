import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { from } from 'rxjs';
import { CreateOrganizationCommand } from '@core-engine';

@Injectable({ providedIn: 'root' })
export class CreateOrganizationService {
  private readonly functions = inject(Functions);

  async createOrganization(command: CreateOrganizationCommand): Promise<string> {
    const callable = httpsCallable<CreateOrganizationCommand, string>(this.functions, 'workspaces-createOrganization');
    return from(callable(command)).toPromise().then((res) => res?.data ?? "");
  }
}

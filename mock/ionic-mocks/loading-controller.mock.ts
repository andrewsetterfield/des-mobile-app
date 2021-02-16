export class LoadingControllerMock {

  create(opts?: any): Promise<HTMLIonLoadingElement> {
    return Promise.resolve({
      present: () => Promise.resolve(),
    } as HTMLIonLoadingElement);
  }

  dismiss = () => Promise.resolve(true);

  getTop(): Promise<HTMLIonLoadingElement | undefined> {
    return Promise.resolve({} as HTMLIonLoadingElement);
  }

}
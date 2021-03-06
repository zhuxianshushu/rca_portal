import { Injectable } from '@angular/core';
import { RCAItem, Attachment } from '@app/entities/rcaItem';
import { FilterCondition } from '@app/entities/filterCondition';
import { IHttpRequester } from '@app/interfaces/IHttpRequester';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ResPackage } from '@app/entities/ResPackage';
import { ProductInfo } from '@app/entities/productInfo';
import { VersionInfo } from '@app/entities/versionInfo';
import { ComponentInfo } from '@app/entities/componentInfo';
import { ReadoutInfo } from '@app/entities/readoutInfo';
import { HotKeyword } from '@app/entities/hotKeyword';
import { AuthenticationService } from '@app/services/authentication.service';
import { PreventionType, PreventionItem, MainTypeInfo, SubTypeInfo, PreventionStatus} from '@app/entities/prevention';


@Injectable({
  providedIn: 'root'
})
export class HttpRequesterService implements IHttpRequester {

  constructor(private http: HttpClient,
              private authenticationService: AuthenticationService ) { }

  GetProducts(): Promise<ProductInfo[]> {
    return new Promise((resolve, reject) => {
      this.http.get<ResPackage>('/api/v1/Products/any')
      .toPromise()
      .then(res => {
        if (res && res.status) {
          resolve(res.data);
        } else {
          reject(res && res.message);
        }
      })
      .catch(this.handleError);
    });
  }
  GetProductVersions(productID: string): Promise<VersionInfo[]> {
    return new Promise((resolve, reject) => {
      this.http.get<ResPackage>('/api/v1/Version/any/' + productID)
      .toPromise()
      .then(res => {
        if (res && res.status) {
          resolve(res.data);
        } else {
          reject(res && res.message);
        }
      })
      .catch(this.handleError);
    });
  }
  GetProductComponents(productID: string): Promise<ComponentInfo[]> {
    return new Promise((resolve, reject) => {
      this.http.get<ResPackage>('/api/v1/Component/any/' + productID)
      .toPromise()
      .then(res => {
        if (res && res.status) {
          resolve(res.data);
        } else {
          reject(res && res.message);
        }
      })
      .catch(this.handleError);
    });
  }
  GetReadOutLevels(): Promise<ReadoutInfo[]> {
    return new Promise((resolve, reject) => {
      this.http.get<ResPackage>('/api/v1/ReadoutLevel/any')
      .toPromise()
      .then(res => {
        if (res && res.status) {
          resolve(res.data);
        } else {
          reject(res && res.message);
        }
      })
      .catch(this.handleError);
    });
  }
  UploadAttachment(rcaID: string, formData: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.post<ResPackage>('api/v1/Resource/one/' + rcaID, formData)
      .toPromise()
      .then(res => {
        if (res && res.status) {
          resolve(true);
        } else {
          reject(res && res.message);
        }
      })
      .catch(this.handleError);
    });
  }
  DeleteAttachment(rcaID: string, attachmentID: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.delete<ResPackage>('api/v1/Resource/one/' + rcaID + '/' + attachmentID)
      .toPromise()
      .then(res => {
        if (res && res.status) {
          resolve(true);
        } else {
          reject(res && res.message);
        }
      })
      .catch(this.handleError);
    });
  }
  GetAttachment( path: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<ResPackage>('api/' + path)
      .toPromise()
      .then(res => {
        if (res && res.status) {
          resolve(res.data);
        } else {
          reject(res && res.message);
        }
      })
      .catch(this.handleError);
    });
  }
  GetAttachments(rcaID: string): Promise<Attachment[]> {
    return new Promise((resolve, reject) => {
      this.http.get<ResPackage>('api/v1/Resource/any/' + rcaID)
      .toPromise()
      .then(res => {
        if (res && res.status) {
          const attachmentArray: Attachment[] = [];
          res.data.forEach( attachObj => {
            const attachmentItem = new Attachment();
            attachmentItem.ID = attachObj.ID;
            const parse = attachObj.Path.split('/');
            attachmentItem.Type = parse[0];
            attachmentItem.Name = parse[1];
            attachmentArray.push(attachmentItem);
          });
          resolve(attachmentArray);
        } else {
          reject(res && res.message);
        }
      })
      .catch(this.handleError);
    });
  }
  CreateRCA(newRCA: RCAItem): Promise<string> {
    return new Promise((resolve, reject) => {
      const body = {
        RCAID: newRCA.RCAID,
        Header: newRCA.Header,
        ImpactedProductID: newRCA.ImpactedProductID,
        FixedVersionID: newRCA.FixVersionID,
        ComponentID: newRCA.ComponentID,
        Keywords: newRCA.KeyWords.toString(),
        ReadoutLevelID: newRCA.ReadoutLevelID,
        RootCauseCR: newRCA.RootCauseCR,
        RootCauseAnalyze: newRCA.RootCauseAnalyze,
        RequirementRootCause: newRCA.RequirementCorrectAndPrevention.RootCause,
        RequirementCorrection: newRCA.RequirementCorrectAndPrevention.Correction,
        RequirementPrevention: newRCA.RequirementCorrectAndPrevention.Prevention,
        DevRootCause: newRCA.DevCorrectAndPrevention.RootCause,
        DevCorrection: newRCA.DevCorrectAndPrevention.Correction,
        DevPrevention: newRCA.DevCorrectAndPrevention.Prevention,
        TestRootCause: newRCA.TestCorrectAndPrevention.RootCause,
        TestCorrection: newRCA.TestCorrectAndPrevention.Correction,
        TestPrevention: newRCA.TestCorrectAndPrevention.Prevention,
      };
      this.http.post<ResPackage>('/api/v1/rca/one/', body)
      .toPromise()
      .then(res => {
        if (res && res.status) {
          let ID = '';
          try {
            ID = res.data[0].id;
          } catch (err) {
            console.log('catch error:' + err);
          }
          resolve(ID);
        } else {
          reject(res && res.message);
        }
      })
      .catch(this.handleError);
    });
  }
  DeleteRCA(rcaID: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.delete<ResPackage>('/api/v1/rca/one/' + rcaID)
      .toPromise()
      .then(res => {
        if (res && res.status) {
          resolve(res.data);
        } else {
          reject(res && res.message);
        }
      })
      .catch(this.handleError);
    });
  }
  UpdateRCA(rcaID: string, updateRCA: any): Promise<boolean> {
    return new Promise((resolve, reject) => {

      this.http.put<ResPackage>('/api/v1/rca/one/' + rcaID, updateRCA)
      .toPromise()
      .then(res => {
        if (res && res.status) {
          resolve(true);
        } else {
          reject(res && res.message);
        }
      })
      .catch(this.handleError);
    });
  }

  GetRCA(rcaID: string): Promise<RCAItem> {
    return new Promise((resolve, reject) => {
      this.http.get<ResPackage>('/api/v1/rca/one/' + rcaID)
      .toPromise()
      .then(res => {
        const RCA = new RCAItem();
        if (res && res.status) {
          RCA.ID = rcaID;
          RCA.Header = res.data[0].Header;
          RCA.RCAID = res.data[0].RCAID;
          RCA.Submitter = res.data[0].Submitter;
          RCA.ImpactedProduct = res.data[0].ImpactedProduct;
          RCA.ImpactedProductID = res.data[0].ImpactedProductID;
          RCA.FixVersion = res.data[0].FixVersion;
          RCA.FixVersionID = res.data[0].FixedVersionID;
          RCA.Component = res.data[0].Component;
          RCA.ComponentID = res.data[0].ComponentID;
          RCA.KeyWords = res.data[0].Keywords.split(',');
          RCA.ReadoutLevel = res.data[0].ReadoutLevel;
          RCA.ReadoutLevelID = res.data[0].ReadoutLevelID;
          RCA.RootCauseCR = res.data[0].RootCauseCR;
          RCA.RootCauseAnalyze = res.data[0].RootCauseAnalyze;
          RCA.RequirementCorrectAndPrevention.RootCause = res.data[0].RequirementRootCause;
          RCA.RequirementCorrectAndPrevention.Correction = res.data[0].RequirementCorrection;
          RCA.RequirementCorrectAndPrevention.Prevention = res.data[0].RequirementPrevention;
          RCA.DevCorrectAndPrevention.RootCause = res.data[0].DevRootCause;
          RCA.DevCorrectAndPrevention.Correction = res.data[0].DevCorrection;
          RCA.DevCorrectAndPrevention.Prevention = res.data[0].DevPrevention;
          RCA.TestCorrectAndPrevention.RootCause = res.data[0].TestRootCause;
          RCA.TestCorrectAndPrevention.Correction = res.data[0].TestCorrection;
          RCA.TestCorrectAndPrevention.Prevention = res.data[0].TestPrevention;
          RCA.IsManagable = this.authenticationService.isHasAccessRight(res.data[0].SubmitterID);
          resolve(RCA);
        } else {
          reject(res && res.message);
        }
      })
      .catch(this.handleError);
    });
  }

  GetRCAs(filterCondition: FilterCondition, start: number, count: number): Promise<RCAItem[]> {
    return new Promise((resolve, reject) => {
      const body: any = {
        pagesize: count,
        startindex: start,
        orderby: 'CreatedTime',
        direction: 'down',
      };
      if (filterCondition.RCAID) {
        body.RCAID = filterCondition.RCAID;
      }
      if (filterCondition.ImpactedProductID) {
        body.ImpactedProductID = filterCondition.ImpactedProductID;
      }
      if (filterCondition.FixVersionID) {
        body.FixedVersionID = filterCondition.FixVersionID;
      }
      if (filterCondition.ComponentID) {
        body.ComponentID = filterCondition.ComponentID;
      }
      if (filterCondition.Submitter == this.authenticationService.currentUserName) {
        body.SubmittedbyUserId = this.authenticationService.currentUserID;
      }
      if (filterCondition.RootCauseCR) {
        body.RootCauseCR = filterCondition.RootCauseCR;
      }
      if (filterCondition.ReadoutLevelID) {
        body.ReadoutLevelID = filterCondition.ReadoutLevelID;
      }
      if (filterCondition.Keywords.length) {
        body.Keywords = filterCondition.Keywords.toString();
      }
      if (filterCondition.QuickSearch) {
        body.QuickSearch = filterCondition.QuickSearch;
      }

      this.http.post<ResPackage>('/api/v1/rca/any/', body)
      .toPromise()
      .then(res => {
        if (res && res.status) {
          const RCArray: RCAItem[] = [];
          res.data.forEach(rcaobj => {
            const RCA = new RCAItem();
            RCA.ID = rcaobj.ID;
            RCA.Header = rcaobj.Header;
            RCA.RCAID = rcaobj.RCAID;
            RCA.Submitter = rcaobj.Submitter;
            RCA.ImpactedProduct = rcaobj.ImpactedProduct;
            RCA.ImpactedProductID = rcaobj.ImpactedProductID;
            RCA.FixVersion = rcaobj.FixVersion;
            RCA.FixVersionID = rcaobj.FixedVersionID;
            RCA.Component = rcaobj.Component;
            RCA.ComponentID = rcaobj.ComponentID;
            RCA.KeyWords = rcaobj.Keywords.split(',');
            RCA.ReadoutLevel = rcaobj.ReadoutLevel;
            RCA.ReadoutLevelID = rcaobj.ReadoutLevelID;
            RCA.RootCauseCR = rcaobj.RootCauseCR;
            RCA.RootCauseAnalyze = rcaobj.RootCauseAnalyze;
            RCA.RequirementCorrectAndPrevention.RootCause = rcaobj.RequirementRootCause;
            RCA.RequirementCorrectAndPrevention.Correction = rcaobj.RequirementCorrection;
            RCA.RequirementCorrectAndPrevention.Prevention = rcaobj.RequirementPrevention;
            RCA.DevCorrectAndPrevention.RootCause = rcaobj.DevRootCause;
            RCA.DevCorrectAndPrevention.Correction = rcaobj.DevCorrection;
            RCA.DevCorrectAndPrevention.Prevention = rcaobj.DevPrevention;
            RCA.TestCorrectAndPrevention.RootCause = rcaobj.TestRootCause;
            RCA.TestCorrectAndPrevention.Correction = rcaobj.TestCorrection;
            RCA.TestCorrectAndPrevention.Prevention = rcaobj.TestPrevention;
            RCA.IsManagable = this.authenticationService.isHasAccessRight(rcaobj.SubmitterID);
            RCArray.push(RCA);
          });
          resolve(RCArray);
        } else {
          reject(res && res.message);
        }
      }).catch(this.handleError);
    });
  }
  GetHotRCAs(start: number, count: number): Promise<RCAItem[]> {
    return new Promise((resolve, reject) => {
      const body: any = {
        pagesize: count,
        startindex: start,
        orderby: 'ReviewedTimes',
        direction: 'down',
      };
      this.http.post<ResPackage>('/api/v1/rca/any/', body)
        .toPromise()
        .then(res => {
          if (res && res.status) {
            const RCArray: RCAItem[] = [];
            res.data.forEach(rcaobj => {
              const RCA = new RCAItem();
              RCA.ID = rcaobj.ID;
              RCA.Header = rcaobj.Header;
              RCA.RCAID = rcaobj.RCAID;
              RCA.Submitter = rcaobj.Submitter;
              RCA.ImpactedProduct = rcaobj.ImpactedProduct;
              RCA.ImpactedProductID = rcaobj.ImpactedProductID;
              RCA.FixVersion = rcaobj.FixVersion;
              RCA.FixVersionID = rcaobj.FixedVersionID;
              RCA.Component = rcaobj.Component;
              RCA.ComponentID = rcaobj.ComponentID;
              RCA.KeyWords = rcaobj.Keywords.split(',');
              RCA.ReadoutLevel = rcaobj.ReadoutLevel;
              RCA.ReadoutLevelID = rcaobj.ReadoutLevelID;
              RCA.RootCauseCR = rcaobj.RootCauseCR;
              RCA.RootCauseAnalyze = rcaobj.RootCauseAnalyze;
              RCA.RequirementCorrectAndPrevention.RootCause = rcaobj.RequirementRootCause;
              RCA.RequirementCorrectAndPrevention.Correction = rcaobj.RequirementCorrection;
              RCA.RequirementCorrectAndPrevention.Prevention = rcaobj.RequirementPrevention;
              RCA.DevCorrectAndPrevention.RootCause = rcaobj.DevRootCause;
              RCA.DevCorrectAndPrevention.Correction = rcaobj.DevCorrection;
              RCA.DevCorrectAndPrevention.Prevention = rcaobj.DevPrevention;
              RCA.TestCorrectAndPrevention.RootCause = rcaobj.TestRootCause;
              RCA.TestCorrectAndPrevention.Correction = rcaobj.TestCorrection;
              RCA.TestCorrectAndPrevention.Prevention = rcaobj.TestPrevention;
              RCA.IsManagable = this.authenticationService.isHasAccessRight(rcaobj.SubmitterID);
              RCArray.push(RCA);
            });
            resolve(RCArray);
          } else {
            reject(res && res.message);
          }
        })
        .catch(this.handleError);
    });
  }
  GetHotKeywords(start: number, count: number): Promise<HotKeyword[]> {
    return new Promise((resolve, reject) => {
      let params = new HttpParams();
      params = params.append('pagesize', count.toString());
      params = params.append('startindex', start.toString());
      params = params.append('orderby', 'QueriedTimes');
      params = params.append('direction', 'down');

      this.http.get<ResPackage>('/api/v1/Keyword/any/', { params })
      .toPromise()
      .then(res => {
        if (res && res.status) {
          const HotKeywords: HotKeyword[] = [];
          if (res.data) {
            try {
              const maxQueriedTime = res.data[0].ReferenceTimes;
              res.data.forEach(KeywordItem => {
                const hotkeyword = new HotKeyword();
                hotkeyword.ID = KeywordItem.ID;
                hotkeyword.KeywordValue = KeywordItem.Keyword;
                hotkeyword.HotValue = KeywordItem.QueriedTimes;
                hotkeyword.RCACount = KeywordItem.ReferenceTimes;
                hotkeyword.HotProp = 100 * KeywordItem.QueriedTimes / maxQueriedTime;
                HotKeywords.push(hotkeyword);
              });
            } catch (err) {
              console.log('catch error:', err);
            }
          }
          resolve(HotKeywords);
        } else {
          reject(res && res.message);
        }
      })
      .catch(this.handleError);
    });
  }

  GetPrevetionTypes(): Promise<PreventionType[]> {
    return new Promise((resolve, reject) => {
      this.http.get<ResPackage>('/api/v1/PreventType/any')
      .toPromise()
      .then(res => {
        if (res && res.status) {
          const prevetionTypes: PreventionType[] = [];
          res.data.forEach( TypeItem => {
            const prevetionType = new PreventionType();
            prevetionType.ID = TypeItem.ID;
            prevetionType.Name = TypeItem.TypeName;
            prevetionTypes.push(prevetionType);
          });
          resolve(prevetionTypes);
        } else {
          reject(res && res.message);
        }
      })
      .catch(this.handleError);
    });
  }

  GetPreventionMainTypes(): Promise<MainTypeInfo[]> {
    return new Promise((resolve, reject) => {
      this.http.get<ResPackage>('/api/v1/PreventMainType/any')
      .toPromise()
      .then(res => {
        if (res && res.status) {
          const mainTypeInfos: MainTypeInfo[] = [];
          res.data.forEach( TypeItem => {
            const mainTypeInfo = new MainTypeInfo();
            mainTypeInfo.ID = TypeItem.ID;
            mainTypeInfo.Name = TypeItem.TypeName;
            mainTypeInfos.push(mainTypeInfo);
          });
          resolve(mainTypeInfos);
        } else {
          reject(res && res.message);
        }
      })
      .catch(this.handleError);
    });
  }

  GetPreventionSubTypes(): Promise<SubTypeInfo[]> {
    return new Promise((resolve, reject) => {
      this.http.get<ResPackage>('/api/v1/PreventSubType/any')
      .toPromise()
      .then(res => {
        if (res && res.status) {
          const subTypeInfos: SubTypeInfo[] = [];
          res.data.forEach( TypeItem => {
            const subTypeInfo = new SubTypeInfo();
            subTypeInfo.ID = TypeItem.ID;
            subTypeInfo.Name = TypeItem.SubTypeName;
            subTypeInfo.MainTypeID = TypeItem.MainID;
            subTypeInfos.push(subTypeInfo);
          });
          resolve(subTypeInfos);
        } else {
          reject(res && res.message);
        }
      })
      .catch(this.handleError);
    });
  }

  GetPreventionStatuses(): Promise<PreventionStatus[]> {
    return new Promise((resolve, reject) => {
      this.http.get<ResPackage>('/api/v1/PreventionStatus/any')
      .toPromise()
      .then(res => {
        if (res && res.status) {
          const PreventionStatuses: PreventionStatus[] = [];
          res.data.forEach( StatusItem => {
            const preventionStatus = new PreventionStatus();
            preventionStatus.ID = StatusItem.ID;
            preventionStatus.Name = StatusItem.Name;
            PreventionStatuses.push(preventionStatus);
          });
          resolve(PreventionStatuses);
        } else {
          reject(res && res.message);
        }
      })
      .catch(this.handleError);
    });
  }

  GetPrevention(rcaID: string, typeID: string): Promise<PreventionItem[]> {
    return new Promise((resolve, reject) => {
      this.http.get<ResPackage>('/api/v1/Prevention/any/' + rcaID)
      .toPromise()
      .then(res => {
        if (res && res.status) {
          const preventionItems: PreventionItem[] = [];
          res.data.forEach( Item => {
            if (Item.PreventionTypeID == typeID) {
              const preventionItem = new PreventionItem();
              preventionItem.ID = Item.ID;
              preventionItem.MainTypeID = Item.MainTypeID;
              preventionItem.SubTypeID =  Item.SubTypeID;
              preventionItem.Details = Item.Details;
              preventionItem.StatusID = Item.PreventionStatusID;
              preventionItems.push(preventionItem);
            }
          });
          resolve(preventionItems);
        } else {
          reject(res && res.message);
        }
      })
      .catch(this.handleError);
    });
  }

  AddPrevention(rcaID: string, preventionItem: PreventionItem, typeID: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const body = {
        MainTypeID: preventionItem.MainTypeID,
        SubTypeID: preventionItem.SubTypeID,
        Details: preventionItem.Details,
        PreventionStatusID: preventionItem.StatusID,
        PreventionTypeID: typeID
      };
      this.http.post<ResPackage>('/api/v1/Prevention/one/' + rcaID, body)
      .toPromise()
      .then(res => {
        if (res && res.status) {
          resolve(true);
        } else {
          reject(res && res.message);
        }
      })
      .catch(this.handleError);
    });
  }

  DeletePrevention(rcaID: string, preventionID: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.delete<ResPackage>('api/v1/Prevention/one/' + rcaID + '/' + preventionID)
      .toPromise()
      .then(res => {
        if (res && res.status) {
          resolve(true);
        } else {
          reject(res && res.message);
        }
      })
      .catch(this.handleError);
    });
  }

  UpdatePrevention(rcaID: string, preventionID: string, updateBody: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.put<ResPackage>('/api/v1/Prevention/one/' + rcaID + '/' + preventionID, updateBody)
      .toPromise()
      .then(res => {
        if (res && res.status) {
          resolve(true);
        } else {
          reject(res && res.message);
        }
      })
      .catch(this.handleError);
    });
  }

  // Add
  AddKeyword(keyWord: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const body = {
        Keyword: keyWord
      };
      this.http.post<ResPackage>('/api/v1/Keyword/one', body)
      .toPromise()
      .then(res => {
        if (res && res.status) {
          resolve(true);
        } else {
          reject(res && res.message);
        }
      })
      .catch(this.handleError);
    });
  }

  AddProduct(productName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const body = {
        ProductName: productName
      };
      this.http.post<ResPackage>('/api/v1/Products/one', body)
      .toPromise()
      .then(res => {
        if (res && res.status) {
          resolve(true);
        } else {
          reject(res && res.message);
        }
      })
      .catch(this.handleError);
    });
  }

  AddComponent(productID: string, componentName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const body = {
        ProductID: productID,
        ComponentName: componentName
      };
      this.http.post<ResPackage>('/api/v1/Component/one', body)
      .toPromise()
      .then(res => {
        if (res && res.status) {
          resolve(true);
        } else {
          reject(res && res.message);
        }
      })
      .catch(this.handleError);
    });
  }

  AddVersion(productID: string, versionName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const body = {
        ProductID: productID,
        Version: versionName
      };
      this.http.post<ResPackage>('/api/v1/Version/one', body)
      .toPromise()
      .then(res => {
        if (res && res.status) {
          resolve(true);
        } else {
          reject(res && res.message);
        }
      })
      .catch(this.handleError);
    });
  }

  PostRCAClickEvent(RCAID: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }

}

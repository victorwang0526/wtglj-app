import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { EnterpriseVo } from "../../models/enterprise-vo";
import { UserProvider } from "../../providers/user-provider";
import { TaskCheckVo } from "../../models/task-check-vo";
import { Subject } from "rxjs";
import { debounceTime, filter, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "page-enterprise-search",
  templateUrl: "enterprise-search.html",
})
export class EnterpriseSearchPage {
  loading: boolean = false;
  key: string;
  shouldShowCancel: boolean = true;
  enterprises: Array<EnterpriseVo> = [];
  taskCheck: TaskCheckVo;
  isShowAdd: boolean;
  searchChange$: Subject<string> = new Subject();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider
  ) {
    this.taskCheck = navParams.get("taskCheck");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad EnterpriseSearchPage");
    this.searchChange$
      .pipe(
        filter((key) => !!key),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((key) =>
        this.userProvider.getEnterprise(key).subscribe((data) => {
          this.enterprises = data.data.list;
          this.isShowAdd = this.enterprises.length === 0;
        })
      );
  }

  onInput(event) {
    this.searchChange$.next(this.key);
  }

  choose(enterprise) {
    this.taskCheck.enterpriseName = enterprise.name;
    this.taskCheck.enterpriseId = enterprise.id;
    this.navCtrl.pop({});
  }

  onCancel(event) {}

  add() {
    this.taskCheck.enterpriseName = this.key;
    this.navCtrl.pop({});
  }
}

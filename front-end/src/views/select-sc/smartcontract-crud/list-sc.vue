<template>
  <div id="body">
    <div id="showConfirmation" v-if="showConfirmation">
        <div id="removeSC-holder">
            <confirm @cancel="closeConfirm" @confirm="cfDeleteSC()" :dialog="deleteDialog"/>
        </div>
    </div>
    <div id="first-section"></div>
    <div id="second-section"></div>
    <div id="third-section">
      <div id="select-section">
        <div
          class="select-box"
          :class="{ chosen_box: chosen_table == 'common' }"
          @click="ChooseTable('common')"
        >
          <p>Common Smart Contracts</p>
        </div>
        <div
          class="select-box"
          :class="{ chosen_box: chosen_table == 'private' }"
          @click="ChooseTable('private')"
        >
          <p>Private Smart Contracts</p>
        </div>
        <div
          class="select-box"
          :class="{ chosen_box: chosen_table == 'pending' }"
          @click="ChooseTable('pending')"
          v-if="isSuperior"
        >
          <p>Pending Smart Contracts</p>
        </div>
      </div>
      <div id="table-section">
        <div id="table-name">
          <div id="add-button" @click="addSmartContract" v-if="showAddButton">
            Add
          </div>
          <p>{{ GetTableName }}</p>
        </div>
        <div id="table-body">
          <div id="table-header" class="table-row">
            <div class="index-cell table-cell">#</div>
            <div class="name-cell table-cell">Smart contracts name</div>
            <div class="date-modified-cell table-cell">Date modified</div>
            <div class="action-cell table-cell">Action</div>
          </div>
          <div id="table-content">
            <div v-for="(sc, idx) in getShowList" :key="idx" class="table-row">
              <div class="index-cell table-cell">
                {{ inc(idx) }}
              </div>
              <div class="name-cell table-cell">
                {{ sc.name }}
              </div>
               
              <div class="date-modified-cell table-cell">
                <!-- {{ convertDate(sc.date_modified) }} -->
              </div>
              <div class="action-cell table-cell">
                <div v-if="chosen_table != 'pending'">
                  <i class="material-icons" @click="editSC(sc.id, sc.name, sc.content)"
                    >edit</i
                  >
                  <i
                    class="material-icons"
                    @click="deleteSC(sc.id, sc.name, chosen_table)"
                    >delete</i
                  >
                </div>
                <div v-else>
                  <i class="material-icons" @click="editSC(sc.id, sc.name, sc.content)"
                    >edit</i
                  >
                  <i
                    class="material-icons"
                    @click="acceptPendingSC(sc.id, sc.name, sc.content)"
                    >check_circle_outline</i
                  >
                  <i
                    class="material-icons"
                    @click="deleteSC(sc.id, sc.name, chosen_table)"
                    >delete</i
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="amsb-footer">
        <div id="itb-entries">
          Show {{ numOfRecod }}/{{ numOfItems }} entries
        </div>
        <div id="itb-cnpage">
          <i class="material-icons" id="itb-first-page-icon" @click="goPage(1)"
            >first_page</i
          >
          <i
            class="material-icons"
            id="itb-pre-page-icon"
            @click="goPage(pageNum > 1 ? pageNum - 1 : 1)"
            >chevron_left</i
          >
          <div id="itb-cnpage-count">{{ countPageNum }}</div>
          <i
            class="material-icons"
            id="itb-next-page-icon"
            @click="goPage(pageNum < numOfPage ? pageNum + 1 : numOfPage)"
            >chevron_right</i
          >
          <i
            class="material-icons"
            id="itb-last-page-icon"
            @click="goPage(numOfPage)"
            >last_page</i
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  GetCommonSmartContracts,
  GetPendingSmartContracts,
  GetPrivateSmartContracts,
  DeleteSmartContracts,
  AcceptPendingSmartContracts,
} from "../../../services/data";

import ConfirmationDialog from "../../../components/ConfirmationDialog.vue" 
export default {
  components: {'confirm': ConfirmationDialog},
  data() {
    return {
      chosen_table: "common",
      list_smart_contracts: {
        common: [],
        private: [],
        pending: [],
      },

      num_of_record: 7,
      num_of_page: 0,
      pageNum: 1,
      showConfirmation: false,
      deleteDialog: {},
      scDelete: null
    };
  },
  mounted() {
    this.fetchData();
    // this.list_smart_contracts.common = GetCommonSmartContracts();
    // this.list_smart_contracts.private = GetPrivateSmartContracts();
    // this.list_smart_contracts.pending = GetPendingSmartContracts();
  },
  computed: {
    GetTableName() {
      if (this.chosen_table == "common") {
        return "Common Smart Contracts";
      }
      if (this.chosen_table == "private") {
        return "Private Smart Contracts";
      }
      if (this.chosen_table == "pending") {
        return "Pending Smart Contracts";
      }
      return "Invalid Table";
    },
    showAddButton() {
      return (
        this.chosen_table != "pending" &&
        (this.chosen_table != "common" ||
          this.$store.state.user.currentUser.role == "admin")
      );
    },
    isSuperior() {
      return this.$store.state.user.currentUser.role == "admin";
    },
    getShowList() {
      let ret = [];
      for (
        let i = 0;
        i < this.list_smart_contracts[this.chosen_table].length;
        i++
      ) {
        if (
          (this.pageNum - 1) * this.num_of_record <= i &&
          this.pageNum * this.num_of_record > i
        ) {
          ret.push(this.list_smart_contracts[this.chosen_table][i]);
        }
      }
      return ret;
    },
    countPageNum() {
      return "" + this.pageNum + "/" + this.numOfPage;
    },
    numOfItems() {
      return this.list_smart_contracts[this.chosen_table].length;
    },
    numOfRecod() {
      if (
        this.list_smart_contracts[this.chosen_table].length <
        this.num_of_record * this.pageNum
      ) {
        return (
          this.list_smart_contracts[this.chosen_table].length -
          this.num_of_record * (this.pageNum - 1)
        );
      }
      return this.num_of_record;
    },
    numOfPage() {
      return Math.ceil(this.numOfItems / this.num_of_record);
    },
  },
  methods: {
    // get common contracts
    async fetchData() {
      console.log('Lay Data')
      this.list_smart_contracts.common = await GetCommonSmartContracts();
      this.list_smart_contracts.private = await GetPrivateSmartContracts();
      this.list_smart_contracts.pending = await GetPendingSmartContracts();
    },
    inc(value) {
      return value + 1;
    },
    convertDate(value) {
      var date = new Date(value);
      var datestring = "" + date.getDate();
      var monthstring = "" + (date.getMonth() + 1);
      var hourstring = "" + date.getHours();
      var minutestring = "" + date.getMinutes();
      hourstring = hourstring.length == 1 ? "0" + hourstring : hourstring;
      minutestring =
        minutestring.length == 1 ? "0" + minutestring : minutestring;
      datestring = datestring.length == 1 ? "0" + datestring : datestring;
      monthstring = monthstring.length == 1 ? "0" + monthstring : monthstring;
      return (
        datestring +
        "/" +
        monthstring +
        "/" +
        date.getFullYear() +
        " " +
        hourstring +
        ":" +
        minutestring
      );
    },
    ChooseTable(value) {
      this.chosen_table = value;
      this.fetchData();
    },
    addSmartContract() {
      this.$router.push({
        name: "AddSc",
        params: { options: this.chosen_table, parent_path: "/list-sc" },
      });
    },
    deleteSC(sc_id, sc_name, option) {
      
        this.deleteDialog={title: "Delete Smart Contract", message:  "Are you sure to delete the Smart Contract named: '" + sc_name + "' ?", confirmbtn: 'Delete'}
        this.showConfirmation = true;
        this.scDelete = {sc_id: sc_id, option: option}
    },
    cfDeleteSC(){
      let sc_id = this.scDelete.sc_id;
      let option = this.scDelete.option
      DeleteSmartContracts(sc_id, option);
        if (option == "common"){
          let list_smart_contracts_afterdelete =  this.list_smart_contracts.common.filter((i)=>{
          return i.id != sc_id
          })
          this.list_smart_contracts.common=list_smart_contracts_afterdelete
        }else if (option == "private"){
          let list_smart_contracts_afterdelete =  this.list_smart_contracts.private.filter((i)=>{
          return i.id != sc_id
          })
          this.list_smart_contracts.private=list_smart_contracts_afterdelete
        }else if (option == "pending"){
          let list_smart_contracts_afterdelete =  this.list_smart_contracts.pending.filter((i)=>{
          return i.id != sc_id
          })
          this.list_smart_contracts.pending=list_smart_contracts_afterdelete
        }
        
        // this.fetchData();
        this.closeConfirm()
    },
    closeConfirm(){
            this.showConfirmation = false
        },
    editSC(sc_id, sc_name, sc_code) {
      this.$router.push({
        name: "EditSc",
        params: { sc_id: sc_id, name: sc_name, code: sc_code, parent_path: "/list-sc" },
      });
    },
    acceptPendingSC(sc_id, sc_name, sc_code) {
       if (
        confirm(
          "Are you sure to accept the pending Smart Contract named: '" + sc_name + "' ?"
        )
      ) {
        AcceptPendingSmartContracts(sc_id, sc_name, sc_code);
      
        this.fetchData();
        }
     
    },
    goPage(value) {
      this.pageNum = value;
    },
  },
  watch: {
    chosen_table: function () {
      this.pageNum = 1;
    },
  },
};
</script>

<style scoped>
#body {
  width: 100%;
  min-width: 750px;
}
#first-section {
  height: 100px;
  width: 100%;
  background-color: #fafafa;
  border-bottom: 1px solid #d8d7d7;
  border-top: 1px solid #d8d7d7;
}
#second-section {
  height: 600px;
  width: 100%;
  background-color: #ffffff;
}
#third-section {
  height: 600px;
  width: 86%;
  margin: 0 auto;
  margin-top: -700px;

  background-color: transparent;
}

#select-section {
  width: 100%;
  height: 70px;
}

.select-box {
  width: 200px;
  height: 40px;

  display: inline-block;
  margin-top: 15px;
  margin-bottom: 15px;
  margin-right: 10px;

  border: 0.5px solid #d8d7d7;
  border-radius: 4px;

  font-size: 15px;
  text-align: center;
  vertical-align: middle;

  cursor: pointer;
}
.select-box p {
  margin-top: 8px;
  color: #1967d2;
}
.select-box:hover {
  background-color: #e9eef7;
}

#table-section {
  width: 100%;
  height: 560px;

  background-color: white;
  border: 1px solid #d8d7d7;
  border-radius: 8px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);
}
#table-name {
  width: 100%;
  height: 80px;

  border-bottom: 1px solid #d8d7d7;
  text-align: center;

  color: #6b6e73;
  padding: 12px;
}
#table-name p {
  font-size: 32px;
}
#table-name #add-button {
  position: absolute;
  margin-top: 15px;
  margin-left: 2%;

  height: 30px;
  width: 60px;
  border: 1px solid #5c5b5b;
  box-shadow: 2px 2px 0px 0px rgb(78, 77, 77);
  padding: 2px;
  cursor: pointer;
}
#table-name #add-button:hover {
  background-color: #d8d7d7;
  color: #272626;
}
#table-body {
  width: 100%;
  height: 520px;
  overflow-y: auto;
}
#table-header {
  background-color: #c9dff0;
  color: #4d4c4c;
  font-size: 16px;
  font-weight: bold;
}

/* --- table row --- */
.table-row {
  width: 100%;
  height: 60px;

  display: flex;
  align-items: center;
  color: #585858;

  border-bottom: 0.5px solid #d8d7d7;
}
.index-cell {
  height: 24px;
  flex-basis: 10%;
  text-align: center;
}
.name-cell {
  height: 24px;
  flex-basis: 40%;
}
.date-modified-cell {
  height: 24px;
  flex-basis: 30%;
}
.action-cell {
  height: 40px;
  flex-basis: 20%;
  text-align: center;
}
.action-cell i {
  padding: 8px;
  color: #858383;
  cursor: pointer;
}
.table-cell {
  overflow: hidden;
  text-overflow: ellipsis;
}
.table-row:hover {
  background-color: #fafafa;
}
.action-cell i:hover {
  color: #5e5d5d;
}

/* --- box --- */
.chosen_box {
  background-color: #e4ecfa;
}
/* ---- amsb-footer ---- */
#amsb-footer {
  width: 100%;
  height: 50px;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  display: flex;
}

#itb-entries {
  font-size: 14px;
  margin-top: 10px;
  margin-left: 2%;
}
#itb-cnpage {
  margin-left: auto;
  order: 2;
  margin-top: 10px;
  margin-right: 2%;
  display: flex;
}

#itb-cnpage i {
  margin-top: 1px;
  font-size: 22px;
  color: #636262;
  cursor: pointer;
}
#itb-cnpage i:hover {
  color: #424141;
}

 /*---- showConfirmation */
 #showConfirmation{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.2);
    z-index: 1;
    align-items: center;
    justify-content: center;
}
#removeSC-holder{
    margin-top: 200px;
}
</style>
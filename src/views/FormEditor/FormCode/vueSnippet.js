import genFormItemCode from "./formSnippet.js";

export const _rules=(validated)=>{
  if(validated){
    return `:rules='rules'`
  }else{
    return ''
  }
}

export const _ref =(validated,ref)=>{
  if (validated) {
    return `ref='${ref}'`;
  } else {
    return `\u0020`;
  }
}
export const _genFormItems=(formObj, validated, formItems)=>{
  return formItems
  .map(item => {
    const func = genFormItemCode(item.type);
    return func(formObj, validated, item.props.label, item.props.value);
  })
  .join("\n");
}


export const _upsertBtn=(validated, ref, method)=>{
  if (validated) {
    return ` 
    <el-form-item>
      <el-button size='mini' type='primary' @click="${method}('${ref}')">创建</el-button>
    </el-form-item>`.trim();
  } else {
    return `<el-form-item>
<el-button size='mini' type='primary' @click='${method}'>创建</el-button>
</el-form-item>`;
  }
}

export const _genData=( formObj, formItems)=>{
  const formdata = formItems
  .map(item => {
    return `${item.props.value}:''`;
  })
  .join(",\n          ");
return `
      ${formObj}:{
          ${formdata}
      }`.trim();
}
export const _genRules=(validated, formItems)=>{
  if(!validated){
    return 
  }
  const formdata = formItems
  .filter(item => {
    return item.props.required;
  })
  .map(item => {
    return `
        ${item.props.value}: [
            { required: true, message: '${
              item.props.label
            }必填', trigger: 'blur' }
        ]`.trim()
  })
  .join(",\n          ");
return `
      rules:{
          ${formdata}
      }`.trim()
}

export const _genSubmitMethod=(validated, confirmed, formObj, method)=>{
  if (confirmed && validated) {
    return `
    ${method}(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('此操作将永久删除此项, 是否继续?', '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(await () => {
                    await ${method}(this.${formObj})
                    this.$message.success('创建成功')
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });
              });
          } else {
            console.log('error submit!!');
            return false;
          }
      });
    }`.trim();
  }

  if (confirmed) {
    return `
    ${method}(formName) {
        this.$confirm('此操作将永久删除此项, 是否继续?', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(await () => {
              await ${method}(this.${formObj})
              this.$message.success('创建成功')
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
        });
      }
    `.trim();
  }
  if (validated) {
    return `
    ${method}(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            await ${method}(this.${formObj})
            this.$message.success('创建成功')
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    }`.trim();
  }
  return `
    async ${method}(){
        await ${method}(this.${formObj})
        this.$message.success('创建成功')
    }`.trim();
}
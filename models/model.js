module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        username: String,
        fullname: String,
        age: String,
        password: String,
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Entry = mongoose.model("User", schema);
    return Entry;
  };